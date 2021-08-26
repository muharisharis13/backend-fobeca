const express = require('express')
const { createToken } = require('../../token/token')
const { decrypt, decrypt1, decrypt2, encrypt2 } = require('../../utl/decrypt-encrypt')
const router = express.Router()

router.get('/session', async function (req, res) {

  res.json({
    token: new Date(1629534431011).toLocaleString('en-US', { timeZone: 'America/New_York' })
  })
})

router.get('/decrypt', async function (req, res) {
  res.json({ message: 'muharis' })
})

router.post('/decrypt', async function (req, res) {
  const { data_ecnrypt } = req.body

  // console.log('ini dia : ', encrypt2('muharis'))
  try {



    res.status(200).json({
      message: "success",
      data: data_ecnrypt,
      decrypt: decrypt2(data_ecnrypt),
      encrypt: encrypt2('muharis')
    })

  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})


module.exports = router;