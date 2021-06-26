const express = require('express')
const router = express.Router()
const orderModel = require('../../../models/orderModels')
const userMobileAppModels = require('../../../models/mobile/userAppModels')
const cartModels = require('../../../models/cartsModels')
const moment = require('moment')
const { json } = require('body-parser')



const number_random = Math.floor(Math.random() * 9999999)




router.get('/completed', async function (req, res) {
  const { id_user } = req.query
  let dataUser
  try {
    if (id_user) {
      const get = await orderModel.find({ status: 'completed', id_user: id_user })

      await userMobileAppModels.findOne({ _id: id_user }).then(res => dataUser = res)

      res.status(200).json({
        message: 'List History',
        data: get.map(item => ({
          _id: item._id,
          date: item.date,
          id_user: {
            _id: dataUser._id,
            email: dataUser.email,
            phone_number: dataUser.phone_number,
          },
          note: item.note,
          id_carts: item.id_carts,
          total: item.total,
          status: item.status,
          invoice: item.invoice,
          list_order: item.list_order,
        }))
      })

    }
    else {
      res.json({
        message: 'Masukkan Id_user'
      })
    }
  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})

router.get('/onGoing', async function (req, res) {
  const { id_user } = req.query
  let dataUser
  try {
    const get = await orderModel.find({ status: 'onProcess', id_user: id_user })

    await userMobileAppModels.findOne({ _id: id_user }).then(res => dataUser = res)

    res.status(200).json({
      message: 'List Order On Going',
      data: get.map(item =>
      ({
        _id: item._id,
        date: item.date,
        id_user: {
          _id: dataUser._id,
          email: dataUser.email,
          phone_number: dataUser.phone_number,
        },
        note: item.note,
        id_carts: item.id_carts,
        total: item.total,
        status: item.status,
        invoice: item.invoice,
        list_order: item.list_order,
      })
      )
    })
  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})


router.get('/', async function (req, res) {
  const { id_order } = req.query
  let dataUser
  let dataCart
  let order
  try {
    await orderModel.findOne({ _id: id_order }).then(async (res) => {
      order = res
      await userMobileAppModels.findOne({ _id: res.id_user }).then(user => dataUser = user)
      await cartModels.findOne({ _id: res.id_carts }).then(cart => dataCart = cart)

    })


    res.status(200).json({
      message: 'success',
      data: {
        _id: order._id,
        date: order.date,
        note: order.note,
        total: order.total,
        status: order.status,
        invoice: order.invoice,
        list_order: order.list_order,
        carts: {
          _id: dataCart._id,
          date: dataCart.date,
          full_name: dataCart.full_name,
          cart_detail: dataCart.cart_detail,
        },
        user: {
          _id: dataUser._id,
          createdAt: dataUser.createdAt,
          phone_number: dataUser.phone_number,
          email: dataUser.email,
        }
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.post('/', async function (req, res) {
  const { id_user, note, id_carts, total, list_order } = req.body
  const { status, id_order } = req.query
  try {

    if (status === 'completed') {
      let data = await orderModel.findOneAndUpdate({ _id: id_order }, {
        status: status
      })

      res.status(200).json({
        message: 'berhasil jadi completed',
        data: data
      })

    }
    else {

      const post = new orderModel({
        id_user: id_user,
        note: note,
        id_carts: id_carts,
        total: total,
        status: 'onProcess',
        invoice: `INVOICE${moment(Date.now()).format('DDMMyyy')}${number_random}`,
        list_order: list_order
      })

      let balanceUser
      await userMobileAppModels.findOne({ '_id': id_user }).then(res => {
        balanceUser = res.balance
      })

      if (parseInt(balanceUser) >= parseInt(total)) {
        let total1
        total1 = parseInt(balanceUser) - parseInt(total)
        await userMobileAppModels.findOneAndUpdate({ _id: id_user }, {
          balance: JSON.stringify(total1)
        })


        const save = await post.save();
        res.json({
          message: 'berhasil order',
          data: save
        })
      }
      else {
        res.json({
          message: 'Balance User Kurang'
        })
      }




    }

  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})


module.exports = router;