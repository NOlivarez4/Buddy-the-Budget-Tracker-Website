const mongoose = require('mongoose')

const pricingSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        membership_name: {
            type: String,
            required: true,
        },
        membership_price_text: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: true
        },
        duration: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
        collection: 'pricing'
    }
)

module.exports = mongoose.model('Pricing', pricingSchema)