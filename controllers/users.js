const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: []
        },
        include: {
          model: ReadingList,
          where: {
            userId: req.params.id
          },
          attributes: ['id', 'read'],
        }
      }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
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