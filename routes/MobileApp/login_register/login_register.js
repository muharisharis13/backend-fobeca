const express = require('express')
const router = express.Router()
let crypto = require('crypto')
const LoginRegisterUserModels = require('../../../models/mobile/userAppModels')


router.delete('/delete', async function (req, res) {
  const { id } = req.query

  try {
    await LoginRegisterUserModels.findOneAndUpdate({ _id: id }, {
      status: false
    })

    res.status(200).json({
      message: 'success delete user',
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.get('/', async function (req, res) {
  try {
    const get = await LoginRegisterUserModels.find({ status: true })

    res.status(200).json({
      message: 'success',
      data: get.map(get => ({
        _id: get._id,
        createdAt: get.createdAt,
        email: get.email,
        phone_number: get.phone_number,
        status: get.status,
        list_favorite: get.list_favorite
      }))
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.post('/login', async function (req, res) {
  const { phone_number, password } = req.body
  try {
    const save = await LoginRegisterUserModels.findOne({
      phone_number: phone_number,
      password: crypto.createHash('md5').update(password).digest('hex')
    })

    res.json({
      message: 'berhasil login',
      data: {
        phone_number: save.phone_number,
        email: save.email
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})


router.post('/register', async function (req, res) {
  const { phone_number, email, full_name, password } = req.body
  const post = new LoginRegisterUserModels({
    full_name: full_name,
    email: email,
    password: crypto.createHash('md5').update(password).digest('hex'),
    phone_number: phone_number,
    status: true,
    balance: 0
  })
  try {
    const save = await post.save();
    res.json({
      message: 'Berhasil Registrasi',
      data: save
    })
  }
  catch (err) {
    res.status(500)
    res.json({
      message: 'Error',
      data: err
    })
  }
})

module.exports = router;