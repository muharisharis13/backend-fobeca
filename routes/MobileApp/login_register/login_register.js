const express = require('express')
const router = express.Router()
let crypto = require('crypto')
const LoginRegisterUserModels = require('../../../models/mobile/userAppModels')
const { createToken } = require('../../../token/token')
const merchantModel = require('../../../models/cartsModels')

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInKm({ lat1, lon1, lat2, lon2 }) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}


router.get('/outlet/near', async function (req, res) {
  const { latitude, longitude } = req.body


  try {

    let data
    await merchantModel.find().then(hasil => data = hasil.filter(hasil => parseFloat(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: hasil.cart_detail.lat, lon2: hasil.cart_detail.long })).toFixed(1) < 5)
    )




    res.json({
      massege: 'success',
      data: data
    })




  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }

})

router.delete('/delete', async function (req, res) {
  const { id } = req.query

  try {
    await LoginRegisterUserModels.findOneAndUpdate({ _id: id }, {
      status: false
    })

    res.status(200).json({
      message: 'success',
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.get('/', async function (req, res) {
  try {
    const get = await LoginRegisterUserModels.find({ status: true })

    if (get.length > 0) {
      res.status(200).json({
        message: 'success',
        data: get.map(get => ({
          _id: get._id,
          createdAt: get.createdAt,
          email: get.email,
          phone_number: get.phone_number,
          status: get.status,
          list_favorite: get.list_favorite
        }))
      })

    }
    else {
      res.json({
        message: 'success',
        daya: get
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})
router.get('/details/:id_user', async function (req, res) {
  const { id_user } = req.params
  try {
    const get = await LoginRegisterUserModels.find({ status: true, _id: id_user })

    if (get.length > 0) {
      res.status(200).json({
        message: 'success',
        data: {
          id_user: get[0]._id,
          createdAt: get[0].createdAt,
          email: get[0].email,
          phone_number: get[0].phone_number,
          balance: get[0].balance,
          full_name: get[0].full_name
        }
      })

    }
    else {
      res.json({
        message: 'error',
        daya: get
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body
  try {

    const save = await LoginRegisterUserModels.findOne({
      email: email,
      password: crypto.createHash('md5').update(password).digest('hex')
    })
        res.status(200).json({
          message: 'success',
          data: {
            id_user: save._id,
            phone_number: save.phone_number,
            email: save.email,
            token: createToken({ payload: { data: save } })
          }
        })


    next()

  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})


router.post('/register', async function (req, res) {
  const { phone_number, email, full_name, password } = req.body
  const post = new LoginRegisterUserModels({
    full_name: full_name,
    email: email,
    password: crypto.createHash('md5').update(password).digest('hex'),
    phone_number: phone_number,
    status: true,
    balance: 0
  })
  try {
    const save = await post.save();
    res.json({
      message: 'success',
      data: save
    })
  }
  catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

module.exports = router;