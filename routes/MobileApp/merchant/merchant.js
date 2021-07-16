const express = require('express')
const router = express.Router()
const userModel = require('../../../models/mobile/userAppModels')
const cartsModel = require('../../../models/cartsModels')
let crypto = require('crypto')
const { createToken, checkToken } = require('../../../token/token')
const orderModel = require('../../../models/orderModels')
const productModel = require('../../../models/ProductModels')
const multer = require('multer')


let storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/testing')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

let upload = multer({ storage: storageFile })


function getId({ req }) {
  return jwt_decode(req.headers.authorization.split(" ")[1]).data._id
}


router.post('/upload/image', upload.single('testing'), async function (req, res) {
  const { nama } = req.body
  try {
    // `http://localhost:1234/uploads/bukti_bayar_penjualan/${req.file.filename}` ===> di simpan url nya
    if (req.file) {
      res.json({
        image: req.file.filename
      })
    }
    else {
      res.json({
        message: 'error',
        data: 'no file in uploads'
      })
    }

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.post('/product/:id_product', checkToken, async function (req, res) {



  try {

    // await productModel.findOne({ _id: req.params.id_product }).then(hasil => res.json(hasil))
    if (req.files) {
      const { id_product } = req.params
      const { product_name, caption, price_product, category } = req.body
      const image_product = req.files.image_product

      await image_product.mv(`./uploads/imageProduct/${image_product.name}`)

      const post = await productModel.findOneAndUpdate({ _id: id_product }, {
        image_product: image_product.name,
        title_product: product_name,
        desc_product: caption,
        price_product: price_product,
        category: category,
        status: true
      })


      res.json({
        message: 'success',
        data: post
      })
    }
    else {



      const post = await productModel.findOneAndUpdate({ _id: req.params.id_product }, {
        image_product: req.body.image_name,
        title_product: req.body.product_name,
        desc_product: req.body.caption,
        price_product: req.body.price_product,
        category: req.body.category,
        status: true
      })



      res.json({
        message: 'success',
        data: post
      })
    }


  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})


router.get('/product', checkToken, async function (req, res) {

  try {
    await productModel.find().then(hasil => {
      res.json({
        message: 'success',
        data: hasil
      })
    })
  } catch (err) {
    res.json({
      message: 'error',
      data: []
    })
  }
})

router.get('/order/completed/:id_merchant', checkToken, async function (req, res) {
  const { id_merchant } = req.params

  try {

    await orderModel.find({ id_carts: id_merchant }).then(hasil => {
      res.json({
        message: 'success',
        data: hasil
      })
    })

  } catch (err) {
    res.json({
      messaage: 'error',
      data: err
    })
  }
})

router.post('/order/completed', checkToken, async function (req, res) {
  const { status, id_order, id_merchant } = req.body

  try {

    if (status === 'completed') {
      await orderModel.findOneAndUpdate({ _id: id_order, id_carts: id_merchant }, {
        status: 'completed'
      }).then(hasil => {

        res.json({
          message: 'success',
          data: {
            date: hasil.date,
            id_order: hasil._id,
            id_user: hasil.id_user,
            note: hasil.note,
            id_merchant: hasil.id_merchant,
            total: hasil.total,
            status: status,
            invoice: hasil.invoice,
            list_order: hasil.list_order.map(order => ({
              id_product: order.id_product,
              price_product: order.price_product,
              category: order.category,
              qty: order.qty
            }))
          }
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

router.get('/order/ongoing/', checkToken, async function (req, res) {
  const id = getId({ req: req })


  try {



    let data = await orderModel.find({ status: 'onProcess', id_carts: id })

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
        message: 'success',
        data: []
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

router.post('/checkPhoneNumber', checkToken, async function (req, res) {
  const { phone_number } = req.body

  try {

    await userModel.findOne({ phone_number: phone_number })
      .then(hasil => {
        if (hasil === null) {
          res.json({
            message: 'error',
            data: 'data tidak ada'
          })
        }
        else {
          res.json({
            messaage: 'success',
            data: {
              id_user: hasil._id,
              email: hasil.email,
              phone_number: hasil.phone_number,
              full_name: hasil.full_name
            }
          })

        }
      })


  } catch (err) {
    res.json({
      message: 'error',
      data: 'data tidak ada'
    })
  }
})

router.post('/topup', async function (req, res) {
  const { amount, phone_number } = req.body
  try {
    if (amount && phone_number) {
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

    }
    else {
      res.json({
        message: 'error',
        data: 'tidak ada amount atau phone number'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

module.exports = router;