const User = require('../models/User')
const bcrypt = require('bcrypt')

const router = require('express').Router()

// get all user
router.get('/', async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})

// get a single user
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        const { password, updatedAt, ...other } = user._doc
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})

// update a user
router.put('/:id', async (req, res) => {

    const { id } = req.params
    const { isAdmin, userId } = req.body
    if (userId === id || isAdmin) {
        try {
            const user = await User.deleteOne(id, { $set: req.body })
            return res.status(200).json({ message: 'Account has been updated!' })
        } catch (error) {
            res.status(500).json(error)
        }
    } else return res.status(403).json({ error: 'You can update only your account!' })
})

// delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const { isAdmin, userId } = req.body
    if (userId === id || isAdmin) {
        try {
            await User.findByIdAndDelete(id)
            return res.status(200).json({ message: 'Account has been deleted!' })
        } catch (error) {
            res.status(500).json(error)
        }

    } else return res.status(403).json({ error: 'You can delete only your account!' })
})

// follow a user

// unfollow a user

module.exports = router