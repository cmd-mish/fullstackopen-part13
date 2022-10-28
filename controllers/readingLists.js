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

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id)

  if (readingList) {
    if (req.decodedToken.id !== readingList.userId) return res.status(401).json({ error: 'you don not have permission to change this reading list' })

    readingList.read = req.body.read
    await readingList.save()
    return res.json(readingList)
  }

  return res.status(404).json({ error: 'list with this id was not found' })
})

module.exports = router