const express = require('express')
const router = express.Router()
const voucherModels = require('../../models/VoucherModels')
const { checkToken } = require('../../token/token')
const multer = require('multer')

router.get('/', checkToken, async function (req, res) {
  const { category } = req.query
  try {

    let data = await voucherModels.find({ category: category })

    res.json({
      message: 'success',
      data: data
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

let storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/voucher')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

let uploadvoucher = multer({ storage: storageFile })

router.post('/', uploadvoucher.single('image_voucher'), async function (req, res) {
  const { title, desc, min_ammount, max_disc, percentage, start_date, end_date, category, list_product, free_item } = req.body


  try {
    if (req.file) {
      const post = new voucherModels({
        title: title,
        desc: desc,
        min_ammount: min_ammount,
        max_disc: max_disc !== "0" ? max_disc : "0",
        percentage: percentage !== "0" ? percentage : "0",
        start_date: Date.now(start_date),
        end_date: new Date(end_date),
        category: category,
        image: `https://warehouse-fobeca.herokuapp.com/view/voucher/${req.file.filename}`,
        list_product: list_product, //list_product di isi dengan id_product yang dapat promo dan jika [] maka semua product promo
        free_item: free_item //kalo category discount di jadikan ""
      })
      const save = await post.save();

      res.json({
        message: 'success',
        data: save
      })

    }
    else {
      res.json({
        message: 'error',
        data: 'no file upload'
      })
    }


  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

module.exports = router;