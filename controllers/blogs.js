const router = require('express').Router()
const { Blog } = require('../models')
const { blogFinder } = require('../util/middleware')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    throw Error(error)
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.destroy()
    return res.status(204).end()
  }
  return res.status(404).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    if (!req.body.likes) {
      return res.status(400).json({ error: 'likes are missing' })
    }

    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  }
  return res.status(404).end()
})

module.exports = router