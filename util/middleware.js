const { Blog } = require('../models')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler,
  blogFinder,
  tokenExtractor
}