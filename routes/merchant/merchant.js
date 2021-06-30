const express = require('express')
const router = express.Router()
const userModel = require('../../models/mobile/userAppModels')
const cartsModel = require('../../models/cartsModels')
let crypto = require('crypto')
const { createToken, checkToken } = require('../../token/token')
const orderModel = require('../../models/orderModels')
const productModel = require('../../models/ProductModels')


router.post('/order/completed', checkToken, async function (req, res) {
  const { status, id_order, id_cart } = req.body

  try {

    if (status === 'completed') {
      await orderModel.findOneAndUpdate({ _id: id_order, id_carts: id_cart }, {
        status: 'completed'
      })
         .then(hasil => {
           res.json({
             message: 'success',
          data: hasil
        })

      })


    }
    else {
      res.status(400).json({
        message: 'error',
        data: `Status ${status} Tidak Di Kenal`
      })
    }

  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.get('/order/ongoing/:id_carts', checkToken, async function (req, res) {
  const { id_carts } = req.params


  try {



    let data = await orderModel.find({ status: 'onProcess', id_carts: id_carts })

    let dataUser = await userModel.find()
    let arrUser = id_user => dataUser.filter(user => `${user._id}` === `${id_user}`)[0]

    let dataProduct = await productModel.find()
    let arrProduct = id_product => dataProduct.filter(product => `${product._id}` === `${id_product}`)[0]


    let dataResponse = data.map(item => ({
      id_order: item._id,
      id_cart: item.id_carts,
      full_name: arrUser(item.id_user).full_name,
      note: item.note,
      total: item.total,
      status: item.status,
      invoice: item.invoice,
      list_order: item.list_order.map(order => ({
        id_product: order.id_product,
        product_name: arrProduct(order.id_product).title_product,
        price_product: order.price_product,
        category: order.category,
        qty: order.qty
      }))
    }))




    if (dataResponse.length > 0) {
      res.json({
        message: 'success',
        data: dataResponse,
      })
    }
    else {
      res.json({
        message: 'error',
        data: 'Nothing Data'
      })
    }

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
            id_merchant: save._id,
            full_name: save.full_name,
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