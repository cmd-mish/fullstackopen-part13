const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })

  if (!req.body.username) {
    return res.status(400).json({ error: 'new username is not provided' })
  }

  if (user) {
    try {
      user.username = req.body.username
      await user.save()
      return res.json(user)
    } catch (error) {
      throw Error(error)
    }
  }

  return res.status(404).end()
})

module.exports = router