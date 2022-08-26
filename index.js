const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

dotenv.config()

const app = express()

//connect to databse
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log('connected to mongoDB')
});

// add middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.listen(8800, () => {
    console.log('Backend server is running!!')
})