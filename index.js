const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

const app = express()

// add middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/users', userRoute)
app.use('/api/', authRoute)
app.use('/api/posts', postRoute)

app.listen(8800, () => {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
        console.log('connected to mongoDB')
    });
})