const express = require('express')
const router = express.Router()
const voucherModels = require('../../models/VoucherModels')


router.post('/', async function (req, res) {
  const { title, desc, min_ammount, max_disc, percentage } = req.body

  const post = new voucherModels({
    title: title,
    desc: desc,
    min_ammount: min_ammount,
    max_disc: max_disc,
    percentage: percentage
  })

  try {
    const save = await post.save();

    res.json({
      message: 'success',
      data: save
    })


  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

module.exports = router;