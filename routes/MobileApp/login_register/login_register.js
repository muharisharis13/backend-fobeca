const express = require('express')
const router = express.Router()
let crypto = require('crypto')
const LoginRegisterUserModels = require('../../../models/mobile/userAppModels')


router.post('/register', async function (req, res) {
  const { phone_number, email, full_name, password } = req.body
  const post = new LoginRegisterUserModels({
    full_name: full_name,
    email: email,
    password: crypto.createHash('md5').update(password).digest('hex'),
    phone_number: phone_number,
    status: true
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