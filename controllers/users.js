const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })

  if (!req.body.username) {
    return res.status(400).json({ error: 'new username is not provided' })
  }

  if (user) {
    user.username = req.body.username
    await user.save()
    return res.json(user)
  }

  return res.status(404).end()
})

module.exports = router