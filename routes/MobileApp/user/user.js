const express = require('express')
const router = express.Router()
let crypto = require('crypto')
const LoginRegisterUserModels = require('../../../models/mobile/userAppModels')
const { createToken, checkToken } = require('../../../token/token')
const merchantModel = require('../../../models/cartsModels')
const productModel = require('../../../models/ProductModels')
const bagBucket = require('../../../models/bagBucketModels')
const jwt_decode = require('jwt-decode')
const orderModels = require('../../../models/orderModels')
const userAppModels = require('../../../models/mobile/userAppModels')
const messageModels = require('../../../models/messageModels')
const bagBucketModels = require('../../../models/bagBucketModels')
const moment = require('moment')
const multer = require('multer')
const VoucherModels = require('../../../models/VoucherModels')
const cartsModels = require('../../../models/cartsModels')
const { SendNotif } = require('../../../utl/sendNotif')


let storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/mobile/profile')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

let uploadProfile = multer({ storage: storageFile })

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

function getId({ req }) {
  return jwt_decode(req.headers.authorization.split(" ")[1]).data._id
}

router.get('/voucher', checkToken, async function (req, res) {
  const id = getId({ req: req })
  try {
    let data = await VoucherModels.find()


    // let data2 = data.filter((item) => item.list_user.indexOf(id) < 0)
    let data2 = data.filter((item) => item.list_user.indexOf(id) < 0).map(item => ({
      id_voucher: item._id,
      title: item.title,
      desc: item.desc,
      min_amount: parseInt(item.min_ammount),
      max_disc: parseInt(item.max_disc),
      percentage: parseInt(item.percentage),
      list_user: item.list_user,
      category: item.category,
      list_product: item.list_product,
      free_item: item.free_item
    }))

    res.json({
      message: 'success',
      data: data2
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})


router.get('/message', checkToken, async function (req, res) {
  const { id } = req.query

  const id_user1 = getId({ req: req })
  try {
    if (id) {
      let message1

      await messageModels.findOne({ _id: id }).then(
        hasil => {
          if (hasil.arr_view.filter(arr => `${arr}` === `${id_user1}`).length > 0) {
            messageModels.findOne({ _id: id }).then(res1 => res.json({
              message: 'success',
              data: res1
            }))
          }
          else {
            messageModels.findOneAndUpdate({ _id: id }, {
              $push: { arr_view: `${id_user1}` }
            }).then(res2 => res.json({
              message: 'success',
              data: res2
            }))
          }
        }
      )

      // res.json({
      //   message: 'success',
      //   // data: {
      //   //   id_message: message._id,
      //   //   date: message.date,
      //   //   title: message.title,
      //   //   content: message.content,
      //   //   image: message.image
      //   // }
      //   data: message1
      // })

    }
    else {
      let message = await messageModels.find().sort([['date', -1]])

      res.json({
        message: 'success',
        data: message.map(item => ({
          id_message: item._id,
          date: item.date,
          title: item.title,
          content: item.content,
          image: item.image,
          read: item.arr_view.filter(id => `${id}` === `${id_user1}`)[0] ? true : false
        }))
      })

    }

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/favorite/get', checkToken, async function (req, res) {
  const id_user = getId({ req: req })

  try {
    let dataProduct = await productModel.find({ favorite_product: `${id_user}` }).sort([['createdAt', -1]])

    res.json({
      message: 'success',
      data: dataProduct.map(item => ({
        id_product: item._id,
        desc_product: item.desc_product,
        image_product: item.image_product,
        price_product: item.price_product,
        title_product: item.title_product,
        createdAt: item.createdAt,
        category: item.category,
        favorite_product: item.favorite_product.find(id => `${id}` === `${id_user}`) ? true : false
      }))
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.post('/favorite/addnremove', checkToken, async function (req, res) {
  const { id_product } = req.body
  const id_user1 = getId({ req: req })
  try {

    let dataProduct
    dataProduct = await productModel.findOne({ _id: id_product, favorite_product: `${id_user1}` })


    // res.json({
    //   message: 'success',
    //   // data: dataProduct.favorite_product,
    //   data1: dataProduct
    // })

    if (dataProduct) {
      if (dataProduct.favorite_product.find(id_user => `${id_user}` === `${id_user1}`) === id_user1) {
        await productModel.findOneAndUpdate({ _id: id_product }, {
          $pull: { favorite_product: `${id_user1}` }
        }).then(hasil => {
          res.json({
            message: 'success',
            data: {
              status: 'remove'
            }
          })
        })

      }

    }

    else if (dataProduct === null) {
      await productModel.findOneAndUpdate({ _id: id_product }, {
        $push: { favorite_product: `${id_user1}` }
      }).then(hasil => {
        res.json({
          message: 'success',
          data: {
            status: 'add'
          }
        })
      })

    }



  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/order/history/:status', checkToken, async function (req, res) {
  const id = getId({ req: req })
  const { status } = req.params
  try {

    let order = await orderModels.find({ id_user: id, status: status }).sort([['date', -1]])
    let onServices = await orderModels.find({ status: 'onProcess' })
    let product1 = await productModel.find()
    let merchant1 = await merchantModel.find()
    let voucher1 = await VoucherModels.find()

    const data = order.map(item => ({
      date: item.date,
      id_order: item._id,
      note: item.note,
      antrian: item.antrian,
      data_merchant: merchant1.filter(id => `${id._id}` === `${item.id_carts}`)[0].cart_detail,
      total: parseInt(item.total),
      status: item.status,
      invoice: item.invoice,
      list_order: item.list_order.map(list_order => ({
        id_product: list_order.id_product,
        title_product: product1.filter(id_product => `${id_product._id}` === `${list_order.id_product}`)[0].title_product,
        price_product: parseInt(list_order.price_product),
        qty: parseInt(list_order.qty),
        category: list_order.category
      })),
      total_disc: parseInt(item.total_disc),
      nama_voucher: voucher1.filter(id => `${id._id}` === `${item.id_voucher}`).length > 0 ? voucher1.filter(id => `${id._id}` === `${item.id_voucher}`)[0].title : "",
      onServices: onServices.filter(id => `${id.status}` === `onProcess`) ? onServices.filter(id => `${id.status}` === `onProcess`)[0].antrian : ""
    }))

    res.json({
      message: 'success',
      data: data
    })

  } catch (error) {
    res.json({
      message: 'error',
      data: error
    })
  }
})


router.post('/order/createorder', checkToken, async function (req, res) {
  const id = getId({ req: req })
  const { note, id_merchant, total, list_order, total_disc, id_voucher } = req.body



  try {

    let post
    let antrian = await orderModels.find({ id_carts: id_merchant })
    let order = await orderModels.find({ id_user: id, status: 'onProcess' }).sort([['createdAt', -1]])
    if (id_voucher !== '-') {
      await VoucherModels.findOneAndUpdate({ _id: id_voucher }, { $push: { list_user: id } })
    }
    let merchant = await cartsModels.findOne({ _id: id_merchant })





    if (antrian.length > 0) {
      post = new orderModels({
        id_user: id,
        note: note,
        id_carts: id_merchant,
        total: JSON.stringify(total),
        status: 'onProcess',
        invoice: `INVOICE${moment(new Date()).format('YYYYMMDDhhmmss')}-${id_merchant}`,
        list_order: list_order,
        antrian: JSON.stringify(Math.max(...antrian.map(antrian => antrian.antrian)) + 1),
        total_disc: total_disc,
        id_voucher: id_voucher,
        date: new Date()
      })
    }
    else {
      post = new orderModels({
        id_user: id,
        note: note,
        id_carts: id_merchant,
        total: JSON.stringify(total),
        status: 'onProcess',
        invoice: `INVOICE${moment(new Date()).format('YYYYMMDDhhmmss')}-${id_merchant}`,
        list_order: list_order,
        antrian: JSON.stringify(parseInt(1)),
        total_disc: total_disc,
        id_voucher: id_voucher
      })
    }


    let balanceUser
    await userAppModels.findOne({ _id: id })
      .then(balance => {
        balanceUser = balance.balance
      })

    if (parseInt(balanceUser) >= parseInt(total)) {
      let total1
      total1 = parseInt(balanceUser) - parseInt(total)
      await userAppModels.findOneAndUpdate({ _id: id }, {
        balance: JSON.stringify(total1)
      })


      await post.save();

      list_order.map(async bag => {
        await bagBucketModels.findOneAndDelete({ _id: bag.id_bag })
      })


      let body = {
        to: `${merchant.device_token}`,
        priority: 'high',
        soundName: "default",
        notification: {
          title: "Ada Order-an Baru",
          body: "Lihat Sekarang !"
        }
      }

      if (antrian.length > 0) {
        SendNotif({ body: body })
        res.json({
          message: 'success',
          data: 'berhasil membuat orderan',
          no_antrian: JSON.stringify(Math.max(...antrian.map(antrian => antrian.antrian)) + 1),
          // onServices: Math.min.apply(Math, order.filter(id => `${id.id_carts}` === `${id_merchant}`).map(item => item.antrian)),
          onServices: antrian.filter(id => `${id.status}` === `onProcess`).length > 0 ? antrian.filter(id => `${id.status}` === `onProcess`)[0].antrian : JSON.stringify(Math.max(...antrian.map(antrian => antrian.antrian)) + 1)
        })



        // res.json(antrian)


      }
      else {
        SendNotif({ body: body })
          res.json({
            message: 'success',
            data: 'berhasil membuat orderan',
            no_antrian: JSON.stringify(parseInt(1)),
            onServices: parseInt(1)
          })

        res.json('ini antrian nyaa')

      }
    }
    else {
      res.json({
        message: 'error',
        data: 'balance user kurang'
      })
    }



  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.post('/bag/deletebag', checkToken, async function (req, res) {
  const { id_bag } = req.body

  try {
    if (id_bag) {
      await bagBucket.findOneAndDelete({ _id: id_bag })
      res.json({
        message: 'success',
        data: 'berhasil delete bag'
      })
    }
    else {
      res.json({
        message: 'error',
        data: 'id bag tidak di temukan'
      })
    }

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/bag/listbag', checkToken, async function (req, res) {
  // const { id_user } = req.params
  let id = getId({ req: req })

  try {
    if (id) {
      let bag = await bagBucket.find({ id_user: id }).sort([['createdAt', -1]])
      let product1 = await productModel.find()

      let data = bag.map(item => ({
        id_bag: item._id,
        id_user: item.id_user,
        id_product: product1.filter(id => `${id._id}` === `${item.id_product}`)[0]._id,
        title_product: product1.filter(id => `${id._id}` === `${item.id_product}`)[0].title_product,
        desc_product: product1.filter(id => `${id._id}` === `${item.id_product}`)[0].desc_product,
        image_product: product1.filter(id => `${id._id}` === `${item.id_product}`)[0].image_product,
        category: product1.filter(id => `${id._id}` === `${item.id_product}`)[0].category,
        price_product: product1.filter(id => `${id._id}` === `${item.id_product}`)[0].price_product,
        qty: item.qty
      }))

      res.json({
        message: 'success',
        data: data
      })

    }
    else {
      res.json({
        message: 'error',
        data: 'id user tidak ada'
      })
    }

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})


router.post('/bag/addBucket', checkToken, async function (req, res) {
  const { id_product, qty } = req.body
  const id_user = getId({ req: req })


  try {

    let bag = await bagBucket.find({ id_user: id_user })
    let product1 = await productModel.find()


    // res.json({
    //   message: 'success',
    //   data: bag.filter(id => id.id_user === id_user)[0]
    // })



    if (bag.filter(id => id.id_user === id_user)[0]) {
      if (bag.filter(id => id.id_product === id_product && id.id_user === id_user)[0]) {
        bagBucket.findOneAndUpdate({ id_product: id_product, id_user: id_user }, {
          qty: JSON.stringify(parseInt(qty) + parseInt(bag.filter(id => id.id_product === id_product && id.id_user === id_user)[0].qty))
        })
          .then(hasil => {
            res.json({
              message: 'success',
              data: {
                id_user: hasil.id_user,
                id_product: hasil.id_product,
                qty: hasil.qty
              }
            })
          })
      }
      else if (!bag.filter(id => id.id_product === id_product && id.id_user === id_user)[0]) {

        new bagBucket({
          id_user: id_user,
          id_product: id_product,
          qty: qty
        }).save().then(data => {
          res.json({
            message: 'success',
            data: {
              id_bag: data._id,
              id_user: data.id_user,
              id_product: data.id_product,
              title_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].title_product,
              desc_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].desc_product,
              image_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].image_product,
              category: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].category,
              price_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].price_product,
              qty: data.qty
            }
          })

        })



      }

    }
    else {
      new bagBucket({
        id_user: id_user,
        id_product: id_product,
        qty: qty
      }).save().then(data => {
        res.json({
          message: 'success',
          data: {
            id_bag: data._id,
            id_user: data.id_user,
            id_product: data.id_product,
            title_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].title_product,
            desc_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].desc_product,
            image_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].image_product,
            category: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].category,
            price_product: product1.filter(id => `${id._id}` === `${data.id_product}`)[0].price_product,
            qty: data.qty
          }
        })

      })


    }




  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/allproduct', checkToken, async function (req, res) {
  const id_user = getId({ req: req })
  try {

    let data = await productModel.find().sort([['createdAt', -1]])

    res.json({
      message: 'success',
      data: data.map(item => ({
        id_product: item._id,
        title_product: item.title_product,
        desc_product: item.desc_product,
        price_product: item.price_product,
        image_product: item.image_product,
        category: item.category,
        createdAt: item.createdAt,
        favorite_product: item.favorite_product.find(id => id === id_user) ? true : false
      }))
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.post('/outlet/near', checkToken, async function (req, res) {
  const { latitude, longitude } = req.body


  try {


    if (latitude && longitude) {


      await merchantModel.find().then(hasil =>

        res.json({
          massege: 'success',
          data: hasil.filter(hasil => parseFloat(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: hasil.cart_detail.lat, lon2: hasil.cart_detail.long })).toFixed(1) < 5)
            .sort((a, b) => (parseInt(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: a.cart_detail.lat, lon2: a.cart_detail.long })) > parseInt(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: b.cart_detail.lat, lon2: b.cart_detail.long })) ? 1 : parseInt(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: b.cart_detail.lat, lon2: b.cart_detail.long })) > parseInt(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: a.cart_detail.lat, lon2: a.cart_detail.long })) ? -1 : 0))
            .map(item => ({
              id_merchant: item._id,
              cart_name: item.cart_detail.cart_name,
              address: item.cart_detail.address,
              lat: item.cart_detail.lat,
              long: item.cart_detail.long,
              distance: parseFloat(getDistanceFromLatLonInKm({ lat1: latitude, lon1: longitude, lat2: item.cart_detail.lat, lon2: item.cart_detail.long })).toFixed(1)
            }))
        })
      )




    }
    else {
      res.json({
        message: 'error',
        data: 'error data'
      })
    }





  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }

})

router.delete('/delete', checkToken, async function (req, res) {
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

router.get('/', checkToken, async function (req, res) {
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

router.post('/details/update', uploadProfile.single('profile_photo'), async function (req, res) {
  const id = getId({ req: req })
  const { full_name, address, phone_number } = req.body

  try {
    if (req.file) {
      await LoginRegisterUserModels.findOneAndUpdate({ _id: id }, {
        full_name: full_name,
        alamat: address,
        phone_number: phone_number,
        profile_photo: `https://warehouse-fobeca.herokuapp.com/user/view/profile/${req.file.filename}`
      }).then(hasil => {
        res.json({
          message: 'success',
          data: {
            id_user: hasil._id,
            createdAt: hasil.createdAt,
            email: hasil.email,
            full_name: full_name,
            address: address,
            balance: hasil.balance,
            phone_number: phone_number,
            photo_profile: `https://warehouse-fobeca.herokuapp.com/user/view/profile/${req.file.filename}`
          }
        })
      })

    }
    else {
      await LoginRegisterUserModels.findOneAndUpdate({ _id: id }, {
        full_name: full_name,
        alamat: address,
        phone_number: phone_number
      }).then(hasil => {
        res.json({
          message: 'success',
          data: {
            id_user: hasil._id,
            createdAt: hasil.createdAt,
            email: hasil.email,
            full_name: full_name,
            address: address,
            balance: hasil.balance,
            phone_number: phone_number,
            photo_profile: hasil.profile_photo
          }
        })
      })
    }

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/details/', checkToken, async function (req, res) {
  const id = getId({ req: req })
  try {
    const get = await LoginRegisterUserModels.find({ status: true, _id: id })

    if (get.length > 0) {
      res.status(200).json({
        message: 'success',
        data: {
          id_user: get[0]._id,
          createdAt: get[0].createdAt,
          email: get[0].email,
          phone_number: get[0].phone_number,
          balance: get[0].balance,
          full_name: get[0].full_name,
          address: get[0].alamat,
          photo_profile: get[0].profile_photo
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
  const { email, password, device_token } = req.body
  try {

    const save = await LoginRegisterUserModels.findOneAndUpdate({
      email: email,
      password: crypto.createHash('md5').update(password).digest('hex')
    }, {
      device_token: device_token
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
    res.json({
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