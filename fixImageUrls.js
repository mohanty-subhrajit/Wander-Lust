const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function fixImageUrls() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // Find all listings
    const listings = await Listing.find({});
    
    for (let listing of listings) {
      let updated = false;
      
      // Check if url has extra quotes or nested object
      if (listing.image && listing.image.url) {
        let url = listing.image.url;
        
        // Remove extra quotes
        if ((url.startsWith("'") && url.endsWith("'")) || 
            (url.startsWith('"') && url.endsWith('"'))) {
          url = url.slice(1, -1);
          updated = true;
        }
        
        // Check if it's a stringified object and extract the URL
        if (url.includes('filename') && url.includes('url')) {
          const urlMatch = url.match(/url:\s*['"](https?:\/\/[^'"]+)['"]/);
          if (urlMatch) {
            url = urlMatch[1];
            updated = true;
          }
        }
        
        if (updated) {
          listing.image.url = url;
          listing.image.filename = "listingimage";
        }
      }
      
      if (updated) {
        await listing.save();
        console.log(`Fixed listing: ${listing._id} - New URL: ${listing.image.url}`);
      }
    }
    
    console.log("All image URLs fixed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    mongoose.connection.close();
  }
}

fixImageUrls();
