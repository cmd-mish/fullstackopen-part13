const router = require('express').Router()
const { Blog, User } = require('../models')
const { blogFinder } = require('../util/middleware')
const { tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search
        }
      },
      {
        author: {
          [Op.substring]: req.query.search
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  return res.json(blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (req.blog.userId !== user.id)
    return res.status(401).json({ error: 'you do not have permission to delete this blog' })

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