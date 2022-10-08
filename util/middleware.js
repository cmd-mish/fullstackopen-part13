const { Blog } = require('../models')

const errorHandler = (error, req, res, next) => {
  if (error.message === 'likes are missing') {
    return res.status(403).json({ error: error.message })
  }

  next(error)
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

module.exports = {
  errorHandler,
  blogFinder
}