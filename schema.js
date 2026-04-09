const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required().max(30),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required().max(27),
        price: joi.number().required().min(300),
        image: joi.string().allow("", null),
        category: joi.string().allow("", null).invalid("Trending"),
        maxGuests: joi.number().integer().min(1).default(1),
        ownerUpiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/).messages({
            "string.pattern.base": "Please enter a valid UPI ID (e.g., yourname@bankname)"
        })
    }).required()
});

module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),

    }).required()
})

module.exports.profileSchema = joi.object({
    profile: joi.object({
        mobileNumber: joi.string().allow("", null).pattern(/^\d{10}$/).messages({
            "string.pattern.base": "Mobile number must be 10 digits"
        }),
        bio: joi.string().allow("", null).max(500),
        address: joi.string().allow("", null).max(200),
        upiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/).messages({
            "string.pattern.base": "Please enter a valid UPI ID (e.g., yourname@bankname)"
        })
    }).required()
});