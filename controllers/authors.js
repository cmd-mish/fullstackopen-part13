const router = require('express').Router()
const { Blog } = require('../models')
const sequelize = require('sequelize')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    order: [['likes', 'DESC']],
    group: 'author'
  })

  res.send(authors)
})

module.exports = router