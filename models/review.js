const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { strict: true });

// Delete the model if it exists to force a refresh
if (mongoose.models.Review) {
    delete mongoose.models.Review;
}

module.exports = mongoose.model("Review", reviewSchema);