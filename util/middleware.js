const { Blog } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.errors[0].validatorKey === 'isEmail') {
    return res.status(400).json({ error: 'username must be a valid email' })
  }
  if (error.errors[0].validatorKey === 'not_unique') {
    return res.status(400).json({ error: 'username is not unique' })
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