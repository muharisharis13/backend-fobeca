const express = require('express')
const router = express.Router()
const productModel = require('../../models/ProductModels')
const userMobileModel = require('../../models/mobile/userAppModels')
const { checkToken } = require('../../token/token')
const multer = require('multer')


let storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/imageProduct')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

let uploadProduct = multer({ storage: storageFile })

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

router.post('/addProduct', uploadProduct.single('product_photo'), async (req, res) => {
  const { title_product, desc_product, price_product, category } = req.body
  try {
    if (req.file) {
      let post = new productModel({
        image_product: `https://warehouse-fobeca.herokuapp.com/user/view/product/${req.file.filename}`,
        title_product: title_product,
        desc_product: desc_product,
        price_product: price_product,
        category: category,
        status: true
      })

      let save = await post.save()

      res.json({
        message: 'success',
        data: save
      })


    }
    else {
      res.send('No file')
    }
  } catch (err) {
    res.json({ message: 'error', data: err })
  }

})


module.exports = router;