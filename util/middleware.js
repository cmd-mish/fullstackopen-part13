const Blog = require('../models/blog')
const Session = require('../models/session')
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
  if (error.errors[0].validatorKey === 'min' || error.errors[0].validatorKey === 'max') {
    return res.status(400).json({ error: 'year is out of range' })
  }

  next(error)
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }

    const currentSession = await Session.findOne({
      where: { userId: req.decodedToken.id, token: authorization.substring(7) }
    })

    if (!currentSession) return res.status(401).json({ error: 'session expired' })

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