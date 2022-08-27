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
router.put('/:id/follow', async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    if (userId !== id) {
        try {
            const user = await User.findById(id)
            const currentUser = await User.findById(userId)
            if (!user.followers.includes(userId)) {
                await user.updateOne({ $push: { followers: userId } })
                await currentUser.updateOne({ $push: { followings: id } })
                res.status(200).json({ message: 'you followed this user' })
            }
            else res.status(403).json({ message: 'you already follow this user' })
        } catch (error) {
            res.status(403).json(error)
        }
    }
    else res.status(403).json({ error: "you can't follow yourself" })
})

// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    const { id } = req.params
    const { userId } = req.body
    if (userId !== id) {
        try {
            const user = await User.findById(id)
            const currentUser = await User.findById(userId)
            if (user.followers.includes(userId)) {
                await user.updateOne({ $pull: { followers: userId } })
                await currentUser.updateOne({ $pull: { followings: id } })
                res.status(200).json({ message: 'you unfollowed this user' })
            }
            else res.status(403).json({ message: "you don't follow this user" })
        } catch (error) {
            res.status(403).json(error)
        }
    }
    else res.status(403).json({ error: "you can't unfollow yourself" })
})

module.exports = router