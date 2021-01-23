const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const authWare = require('../../middleware/auth')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route   POST api/posts
// @desc    Create a post
// access   Private
router.post(
  '/',
  [authWare, [check('text', 'Text is Required.').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })

      const post = await newPost.save()
      res.json(post)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   GET api/posts
// @desc    Get all posts
// access   Private
router.get('/', authWare, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/posts/:id
// @desc    Get post by id
// access   Private
router.get('/:id', authWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' })
    }
    res.json(post)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post Not Found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route   DELETE api/:id
// @desc    Delete a post
// access   Private
router.delete('/:id', authWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' })
    }

    //Check if post belongs to user.
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User is not authorized.' })
    }
    await post.remove()

    res.json({ message: 'Post Removed' })
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post Not Found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route   PUT api/posts/unlike/:id
// @desc    Likeike a post
// @access  Private
router.put('/like/:id', authWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //check if post has already been liked by said user.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ message: 'You already liked this post...' })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post.likes)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error.')
  }
})

// @route   PUT api/posts/like/:id
// @desc    unlike a post
// @access  Private
router.put('/unlike/:id', authWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //check if post has already been liked by said user.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ message: "You haven't liked this post yet..." })
    }

    const indexTBRemoved = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(indexTBRemoved, 1)
    await post.save()
    res.json(post.likes)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error.')
  }
})

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// access   Private
router.post(
  '/comment/:id',
  [authWare, [check('text', 'Text is Required.').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const post = await Post.findById(req.params.id)

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment)

      await post.save()

      res.json(post.comments)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', authWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //Extract the comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )
    //Make sure the comment exists
    if (!comment) {
      return res.status(404).json({ message: 'No such comment exists' })
    }
    // Check if the user exists
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User does not exist' })
    }

    const indexTBRemoved = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)

    post.comments.splice(indexTBRemoved, 1)
    await post.save()
    res.json(post.comments)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
