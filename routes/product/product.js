const express = require('express')
const router = express.Router()
const productModel = require('../../models/ProductModels')

router.get('/', async (req, res) => {
  if (req.query.id) {
    try {
      let data = await productModel.findOne({ '_id': req.query.id })
      res.json({
        message: 'Data Details',
        data: data
      })
    } catch (err) {
      res.status(500)
      res.json({ message: error })
    }

  }
  else {
    try {
      let data = await productModel.find({ 'status': true })
      res.json(data)
    } catch (err) {
      res.status(500)
      res.json({ message: error })
    }

  }
})





router.post('/addProduct', async (req, res) => {
  try {
    if (req.files) {
      const image_product = req.files.image_product

      await image_product.mv(`./uploads/imageProduct/${image_product.name}`);


      const post = new productModel({
        image_product: image_product.name,
        title_product: req.body.title_product,
        desc_product: req.body.desc_product,
        price_product: req.body.price_product,
        status: true
      })

      const save = await post.save();
      res.json({
        message: 'Berhasil Tambah product',
        data: save
      })

    }
    else {
      res.send('No file')
    }
  } catch (err) {
    res.status(500)
    res.json({ message: err })
  }

})


module.exports = router;