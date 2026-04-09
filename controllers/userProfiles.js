const User = require("../models/user.js");

// Render user profile
module.exports.renderProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("users/profile.ejs", { user });
};

// Render edit profile form
module.exports.renderEditProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("users/editProfile.ejs", { user });
};

// Update user profile
module.exports.updateProfile = async (req, res) => {
  const { mobileNumber, bio, address, upiId } = req.body.profile;
  const userId = req.user._id;
  
  // Validate mobile number (basic validation)
  if (mobileNumber && !/^\d{10}$/.test(mobileNumber.replace(/\D/g, ''))) {
    req.flash("error", "Please enter a valid 10-digit mobile number!");
    return res.redirect("/users/profile/edit");
  }
  
  // Validate UPI ID format
  if (upiId && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
    req.flash("error", "Please enter a valid UPI ID (e.g., yourname@bankname)!");
    return res.redirect("/users/profile/edit");
  }
  
  try {
    let updateData = {
      mobileNumber,
      bio,
      address,
      upiId
    };
    
    // Handle profile photo if uploaded
    if (typeof req.file !== "undefined") {
      updateData.profilePhoto = {
        url: req.file.path,
        filename: req.file.filename
      };
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    req.flash("success", "Profile updated successfully!");
    res.redirect("/users/profile");
  } catch (error) {
    console.error("Profile update error:", error);
    req.flash("error", "Error updating profile. Please try again.");
    res.redirect("/users/profile/edit");
  }
};

// View any user's public profile (future feature)
module.exports.viewUserProfile = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  
  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/listings");
  }
  
  res.render("users/viewProfile.ejs", { user });
};
