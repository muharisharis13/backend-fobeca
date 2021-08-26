const express = require('express')
const router = express.Router()
let crypto = require('crypto')
const multer = require('multer')
const adminModels = require('../../../models/adminModels')
const { createToken } = require('../../../token/token')
const courierModels = require('../../../models/couriersModels')
const cartModels = require('../../../models/cartsModels')
const transactionModels = require('../../../models/transactionModels')


// router.post('/addVoucher', async function(req, res){
//   try {

//   } catch (err) {
//     res.json({
//       message:'error',
//       data:
//     })
//   }
// })

router.get('/merchant', async function (req, res) {
  try {
    let data = await cartModels.find()

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

router.get('/merchant_courier', async function (req, res) {
  try {
    let merchant = await cartModels.find()
    let courier = await courierModels.find()

    res.status(200).json({
      message: 'success',
      data: {
        merchant: merchant,
        courier: courier
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.get('/total_data', async function (req, res) {
  try {
    let courier = await courierModels.find()
    let cart = await cartModels.find()
    let transaction = await transactionModels.find()

    res.status(200).json({
      message: 'success',
      data: {
        courier: courier.length,
        cart: cart.length,
        purchasing: transaction.length
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.post('/login', async function (req, res, next) {
  const { username, password } = req.body

  try {

    let data = await adminModels.findOne({
      username: username,
      password: crypto.createHash('md5').update(password).digest('hex')
    })

    res.json({
      message: 'success',
      data: {
        username: data.username,
        token: createToken({ payload: { data: data } })
      }
    })



  } catch (err) {
    res.json({
      message: 'error',
      data: 'username atau password salah !'
    })
  }
})

let storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/admin/ktp')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

let uploadKtp = multer({ storage: storageFile })

router.post('/add', uploadKtp.single('ktp_image'), async function (req, res) {
  const { username, password, role, phone_number } = req.body

  try {
    if (req.file) {
      let post = new adminModels({
        username: username,
        password: crypto.createHash('md5').update(password).digest('hex'),
        role: role,
        admin_info: {
          ktp: `https://warehouse-fobeca.herokuapp.com/view/document/ktp/${req.file.filename}`,
          phone_number: phone_number
        }
      })

      let save = await post.save()

      res.json({
        message: 'success',
        data: save
      })
    }
    else {
      res.send('No File Upload')
    }

    // res.json({
    //   message: 'success',
    //   data: req.body,
    //   file: req.file
    // })


  } catch (err) {
    res.json({
      message: 'error',
      data: (
        err.keyPattern.username === 1 ? 'Username Sudah Ada' :
          err.keyPattern && err.keyValue
      )
    })
  }
})



module.exports = router;