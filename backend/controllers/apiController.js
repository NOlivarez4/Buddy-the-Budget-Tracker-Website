const asyncHandler = require('express-async-handler')
const Feature = require('../model/featureModel')
const Pricing = require('../model/pricingModel')
const Testimonial = require('../model/testimonialModel')

const getSiteData = asyncHandler(async (req, res) => {
    const features = await Feature.find({})
    const pricing = await Pricing.find({})
    const testimonials = await Testimonial.find({})

    res.status(200).json({
        features,
        pricing,
        testimonials
    })
})

module.exports = { getSiteData }