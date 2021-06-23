const express = require('express')
const router = express.Router()
const orderModel = require('../../../models/orderModels')


router.post('/', async function (req, res) {
  try {
    const { id_user, note, lat, long, total, list_order } = req.body

    const post = new orderModel({
      id_user: id_user,
      note: note,
      lat: lat,
      long: long,
      total: total,
      status: 'onProcess',
      list_order: list_order
    })

    const save = await post.save();

    res.json({
      message: 'berhasil order',
      data: save
    })



  } catch (err) {
    res.status(500)
    res.json({
      message: err
    })
  }
})


module.exports = router;