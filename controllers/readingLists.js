const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { ReadingList, Blog, User } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
  const body = req.body
  const blog = await Blog.findByPk(body.blogId)
  const user = await User.findByPk(body.userId)

  if (!blog) return res.status(404).json({ error: 'blog with this id was not found' })
  if (!user) return res.status(404).json({ error: 'user with this id was not found' })

  ReadingList.create(body)
  res.send(body)
})

module.exports = router