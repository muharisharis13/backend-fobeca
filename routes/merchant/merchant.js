const express = require('express')
const router = express.Router()
const userModel = require('../../models/mobile/userAppModels')
const cartsModel = require('../../models/cartsModels')
let crypto = require('crypto')
const { createToken, checkToken } = require('../../token/token')
const orderModel = require('../../models/orderModels')


router.get('/order/ongoing', checkToken, async function (req, res) {
  const { id_carts } = req.params
  try {
    await orderModel.find({ status: 'onProcess', id_carts: id_carts })
      .then(hasil => {
        if (hasil.length > 0) {
          res.json({
            message: 'success',
            data: hasil
          })
        }
        else {
          res.json({
            message: 'error',
            data: 'Nothing Data'
          })
        }
      })

  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.post('/login', async function (req, res) {
  const { email, password } = req.body
  try {
    if (email && password) {
      const save = await cartsModel.findOne({
        password: crypto.createHash('md5').update(password).digest('hex'),
        email: email.toLowerCase(),
      })

      if (save === null) {
        res.json({
          message: 'error',
          data: 'Email atau Password Salah !'
        })
      }
      else {

        res.json({
          message: 'success',
          data: {
            token: createToken({
              payload: { save }
            }),
            full_name: save.full_name,
            _id: save._id,
            carts_name: save.cart_detail.cart_name

          },
        })
      }

    }
    else {
      res.json({
        message: 'error',
        data: 'Email atau Password Salah !'
      })
    }


  } catch (err) {
    res.status(500).json({

      message: 'error',
      data: err
    })
  }
})

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

router.post('/checkPhoneNumber', async function (req, res) {
  const { phone_number } = req.body

  try {

    await userModel.findOne({ phone_number: phone_number })
      .then(hasil => {
        res.json({
          messaage: 'success',
          data: {
            _id: hasil._id,
            email: hasil.email,
            phone_number: hasil.phone_number,
            balance: hasil.balance
          }
        })
      })

  } catch (err) {
    res.json({
      message: 'error',
      data: 'data not exist'
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
      message: 'success',
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