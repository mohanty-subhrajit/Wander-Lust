const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required().max(30),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required().max(27),
        price: joi.number().required().min(300),
        image: joi.string().allow("", null),
        category: joi.string().allow("", null),
        maxGuests: joi.number().integer().min(1).default(1)
    }).required()
});

module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),

    }).required()
})