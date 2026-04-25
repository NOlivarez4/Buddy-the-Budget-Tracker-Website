const mongoose = require('mongoose')

const testimonialSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        collection: 'testimonials'
    }
)

module.exports = mongoose.model('Testimonial', testimonialSchema)