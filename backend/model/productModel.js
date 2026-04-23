const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    membership_name: {
      type: String,
      required: [true, 'Please add a membership name'],
      trim: true,
    },
    membership_price_text: {
      type: String,
      required: [true, 'Please add a price'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image']
    },
    active: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      required: [true, 'Please add a duration']
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Product', productSchema)