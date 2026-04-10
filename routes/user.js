const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn, isAdmin, validateProfile } = require("../middleware.js");
const userController = require("../controllers/users.js");
const userProfileController = require("../controllers/userProfiles.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { 
      failureRedirect: '/login', 
      failureFlash: true
    }),
    userController.login
  );

router.get("/logout", userController.logout);

// User Profile Routes
router.get("/profile", isLoggedIn, wrapAsync(userProfileController.renderProfile));
router.get("/profile/edit", isLoggedIn, wrapAsync(userProfileController.renderEditProfile));
router.post("/profile/edit", isLoggedIn, validateProfile, upload.single("profile[profilePhoto]"), wrapAsync(userProfileController.updateProfile));
router.get("/view/:userId", wrapAsync(userProfileController.viewUserProfile));

// Admin routes for user management
router.get("/admin/users", isLoggedIn, isAdmin, wrapAsync(userController.allUsers));
router.delete("/admin/users/:id", isLoggedIn, isAdmin, wrapAsync(userController.deleteUser));

module.exports = router;