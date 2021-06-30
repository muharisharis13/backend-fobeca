const express = require('express')
const router = express.Router()
const productModel = require('../../models/ProductModels')
const userMobileModel = require('../../models/mobile/userAppModels')
const { checkToken } = require('../../token/token')

router.post('/removeFavorite', async function (req, res) {
  const { id, id_user } = req.body
  try {
    let arrayFav
    await productModel.findOne({ "_id": id }).then(res => {
      arrayFav = res.favorite_product
    })
    arrayFav.push(id_user)

    // res.json(arrayFav)


    let save = await productModel.findOneAndUpdate({ '_id': id }, {
      favorite_product: arrayFav
    })


    res.json({
      message: 'success',
      data: save
    })


  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.post('/addFavorite', async function (req, res) {
  const { id, id_user } = req.body
  try {
    let arrayFav
    let listArrayFav
    await productModel.findOne({ "_id": id }).then(res => {
      arrayFav = res.favorite_product
    })

    await userMobileModel.findOne({ "_id": id_user }).then(res => {
      listArrayFav = res.list_favorite
    })

    arrayFav.push(id_user)
    listArrayFav.push(id)

    // res.json(arrayFav)


    let save = await productModel.findOneAndUpdate({ '_id': id }, {
      favorite_product: arrayFav
    })

    await userMobileModel.findOneAndUpdate({ '_id': id_user }, {
      list_favorite: listArrayFav
    })


    res.json({
      message: 'success'
    })


  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.get('/', checkToken, async (req, res) => {
  if (req.query.id) {
    try {
      let data = await productModel.findOne({ '_id': req.query.id })
      res.json({
        message: 'Data Details',
        data: data
      })
    } catch (err) {
      res.status(500)
      res.json({ message: err })
    }

  }
  else {
    try {
      let data = await productModel.find({ 'status': true })
      res.json(data)
    } catch (err) {
      res.status(500)
      res.json({ message: err })
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
        category: req.body.category,
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