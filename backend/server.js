const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')

const port = process.env.PORT || 5555

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '../frontend/public')))
app.use(express.static(path.join(__dirname, '../frontend')))

app.use('/api/pricing', require('./routes/productRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api', require('./routes/apiRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))

