const express = require('express')
const router = express.Router()
const orderModel = require('../../../models/orderModels')
const userMobileAppModels = require('../../../models/mobile/userAppModels')
const moment = require('moment')

const number_random = Math.floor(Math.random() * 9999999)


router.get('/completed', async function (req, res) {
  try {
    const get = await orderModel.find({ status: 'completed' })

    res.status(200).json({
      message: 'List History',
      data: get
    })
  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})

router.get('/onGoing', async function (req, res) {
  try {
    const get = await orderModel.find({ status: 'onProcess' })

    res.status(200).json({
      message: 'List Order On Going',
      data: get
    })
  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})



router.post('/', async function (req, res) {
  const { id_user, note, lat, long, id_carts, total, list_order } = req.body
  try {

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





  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})


module.exports = router;