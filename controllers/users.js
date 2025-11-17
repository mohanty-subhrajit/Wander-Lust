const User = require("../models/user.js");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Signup User
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wander lust");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Login User
module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust! You are logged in!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

// Logout User
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        return res.redirect("/listings");
    });
};

// Admin: View all users
module.exports.allUsers = async (req, res) => {
  const users = await User.find({});
  res.render("users/adminUsers.ejs", { users });
};

// Admin: Delete user account
module.exports.deleteUser = async (req, res) => {
  let { id } = req.params;
  
  // Prevent deletion of admin account
  const user = await User.findById(id);
  if (user.username === "LAPU") {
    req.flash("error", "Cannot delete the admin account!");
    return res.redirect("/users/admin/users");
  }

  // Delete user's listings
  await Listing.deleteMany({ owner: id });
  
  // Delete user's bookings (as customer)
  await Booking.deleteMany({ customer: id });
  
  // Delete user's reviews
  await Review.deleteMany({ author: id });
  
  // Delete the user
  await User.findByIdAndDelete(id);
  
  req.flash("success", "User account and associated data deleted!");
  res.redirect("/users/admin/users");
};
