const asyncHandler = require('express-async-handler')

// Import Product and User models
const Product = require('../model/pricingModel')
const User = require('../model/userModel')

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 })
    res.status(200).json(products)
})

const setProduct = asyncHandler(async (req, res) => {
    if (
        req.body.id === undefined ||
        !req.body.membership_name ||
        !req.body.membership_price_text ||
        !req.body.description ||
        !req.body.image ||
        req.body.duration === undefined
    ) {
        res.status(400)
        throw new Error("Please add all required product fields.")
    }

    const product_created = await Product.create({
        id: req.body.id,
        membership_name: req.body.membership_name,
        membership_price_text: req.body.membership_price_text,
        description: req.body.description,
        image: req.body.image,
        active: req.body.active,
        duration: req.body.duration
    })

    res.status(200).json(product_created)
})

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }

    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            id: req.body.id,
            membership_name: req.body.membership_name,
            membership_price_text: req.body.membership_price_text,
            description: req.body.description,
            image: req.body.image,
            active: req.body.active,
            duration: req.body.duration
        },
        { new: true }
    )

    res.status(200).json(updatedProduct)
})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }

    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    await product.deleteOne()

    res.status(200).json({ message: `Deleted product ${req.params.id}` })
})

module.exports = {
    getProducts,
    setProduct,
    updateProduct,
    deleteProduct
}