// ── DNS Override --------------------------────
const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

// ── Core Dependencies --------------------------
const express = require('express')
const path = require('path')
require('dotenv').config()

// ── App-specific Imports --------------------------
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')

const port = process.env.PORT || 5555

// ── Database Connection --------------------------
connectDB()

// ── Express App Setup --------------------------
const app = express()

// ── Middleware Stack --------------------------
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend/public')))
app.use(express.static(path.join(__dirname, '../frontend')))
// ── API Routes --------------------------
// Mount the product and user routers under their respective base paths.
// All routes defined in productRoutes.js are prefixed with /api/products
// All routes defined in userRoutes.js are prefixed with /api/users
app.use('/api/pricing', require('./routes/productRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api', require('./routes/apiRoutes'))

// ── Global Error Handler --------------------------
// Must be registered LAST
app.use(errorHandler)

// ── Start Server--------------------------
app.listen(port, () => console.log(`Server started on port ${port}`))

// ── Key Logic Reminders --------------------------
// 1: dotenv must run first to ensure process.env.MONGO_URI and others are available.

// 2: Middleware order is intentional — Body parsers must come before routes so 
//    req.body is available in your product controllers.

// 3: Why errorHandler must be last — It catches any errors thrown in product 
//    or user routes and formats them as JSON.