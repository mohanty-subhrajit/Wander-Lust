const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient= mbxGeocoding({ accessToken: mapToken });

// Index - Show all listings
module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};
  
  // Filter by category
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  // Search by country
  if (search) {
    filter.country = { $regex: search, $options: 'i' }; // Case-insensitive search
  }
  
  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings });
};

// Render New Form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show Listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// Create Listing
module.exports.createListing = async (req, res, next) => {
 let response =await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
.send()
 
// console.log(response.body.features[0].geometry);
// res.send("done!");

  if (!req.file) {
    req.flash("error", "No file uploaded. Please upload an image.");
    return res.redirect("/listings/new");
  }

  const { path: url, filename } = req.file;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  let savedListing =await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
 let originalImageurl= listing.image.url;
originalImageurl =originalImageurl.replace("/upload","/upload/h_300");

  res.render("listings/edit.ejs", { listing ,originalImageurl});
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  
  // Fetch new coordinates if location is updated
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();
  
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  // Update geometry with new coordinates
  if (response.body.features.length > 0) {
    listing.geometry = response.body.features[0].geometry;
  }
  
  // Update image if new file uploaded
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
  }
  
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Was Deleted successfuly!");
  res.redirect("/listings");
};