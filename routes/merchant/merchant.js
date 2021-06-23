const express = require('express')
const router = express.Router()
const userModel = require('../../models/mobile/userAppModels')


router.get('/', async function (req, res, { phone_number }) {
  try {
    const save = await userModel.findOne({ phone_number })

    res.status(200).json({
      data: save
    })
  } catch (err) {
    res.status(500).json({
      data: err
    })
  }
})


router.post('/topup', async function (req, res) {
  const { amount, phone_number } = req.body
  try {
    let balanceUser
    await userModel.findOne({ phone_number: phone_number }).then(res => {
      balanceUser = res.balance
    })

    let total = parseInt(balanceUser) + parseInt(amount)

    const save = await userModel.findOneAndUpdate({ phone_number: phone_number }, {
      balance: JSON.stringify(total)
    })
    res.status(200).json({
      message: 'berhasil top up',
      data: {
        balance: amount,
        phone_number: save.phone_number
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

module.exports = router;