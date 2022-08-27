const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        // save user
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    !user && res.status(404).json({ message: 'user not found' })

    const validPassowrd = await bcrypt.compare(password, user.password)
    !validPassowrd && res.status(400).json({ error: 'wrong password' })

    res.status(200).json(user)
})


module.exports = router