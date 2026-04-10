const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isAdmin } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage})

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapAsync(listingController.createListing));


router.get("/new", isLoggedIn, listingController.renderNewForm);

// Admin Routes
router.get("/admin/all-listings", isLoggedIn, isAdmin, wrapAsync(listingController.adminListings));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;