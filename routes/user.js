const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn, isAdmin } = require("../middleware.js");
const userController = require("../controllers/users.js");

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

// Admin routes for user management
router.get("/users/admin/users", isLoggedIn, isAdmin, wrapAsync(userController.allUsers));
router.delete("/users/admin/users/:id", isLoggedIn, isAdmin, wrapAsync(userController.deleteUser));

module.exports = router;