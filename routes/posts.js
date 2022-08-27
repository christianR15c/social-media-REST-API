const router = require('express').Router()
const Post = require('../models/Post')

// create a post
router.post('/', async (req, res) => {
    const newPost = Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})

// update a post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json({ message: 'The post has been updated' })
        }
        else res.status(403).json({ error: " you can update only your post" })
    } catch (error) {
        res.status(500).json(error)
    }
})


// delete a post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        if (post.userId === userId) {
            await post.deleteOne()
            res.status(200).json({ message: 'The post has been deleted' })
        }
        else res.status(403).json({ error: " you can delete only your post" })
    } catch (error) {
        res.status(500).json(error)
    }

})

// like a post
// get a post
router.get('/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(403).json(error)
    }
})

// get timeline posts

module.exports = router