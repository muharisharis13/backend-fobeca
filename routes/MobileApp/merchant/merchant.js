const express = require('express')
const router = express.Router()
const userModel = require('../../../models/mobile/userAppModels')
const cartsModel = require('../../../models/cartsModels')
let crypto = require('crypto')
const { createToken, checkToken } = require('../../../token/token')
const orderModel = require('../../../models/orderModels')
const productModel = require('../../../models/ProductModels')
const orderOnsiteModel = require('../../../models/orderOnsiteModels')
const multer = require('multer')
const jwt_decode = require('jwt-decode')
const moment = require('moment')
const expenseModels = require('../../../models/expenseModels')


let storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/imageProduct')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

let uploadProduct = multer({ storage: storageFile })



function getId({ req }) {
  return  jwt_decode(req.headers.authorization.split(" ")[1]).save._id
}

router.get('/order/history/cashier', checkToken, async function (req, res) {
  const id = getId({ req: req })
  try {
    let data = await orderOnsiteModel.find({ id_carts: id })
    let product = await productModel.find()

    res.json({
      message: 'success',
      data: data.sort(function (a, b) { return new Date(b.date) - new Date(a.date) }).map(item => ({
        id_order_onsite: item._id,
        date: item.date,
        order_type: item.order_type,
        list_order: item.list_order.map(list_order => ({
          title_product: product.filter(product => `${product._id}` === `${list_order.id_product}`)[0].title_product,
          image_product: product.filter(product => `${product._id}` === `${list_order.id_product}`)[0].image_product,
          qty: parseInt(list_order.qty),
          price_product: parseInt(list_order.price)
        })),
        total: parseInt(item.total),
        total_disc: parseInt(item.total_disc),
        payment_method: item.payment_method,
        invoice: item.invoice
      }))
    })
  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.post('/addProduct', checkToken, uploadProduct.single('product_photo'), async (req, res) => {
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


router.get('/statistic/net_sales', checkToken, async function (req, res) {
  const id = getId({ req: req })

  try {
    let order = await orderModel.find({ id_carts: id })
    let order_onsite = await orderOnsiteModel.find({ id_carts: id })
    let all_sales = order.concat(order_onsite)
    let expense = await expenseModels.find({ id_carts: id })


    var result = [];
    all_sales.reduce(function (res, value) {
      if (!res[moment(value.date).format('YYYY-MM-DD')]) {
        res[moment(value.date).format('YYYY-MM-DD')] = { date: moment(value.date).format('YYYY-MM-DD'), total: 0 };
        result.push(res[moment(value.date).format('YYYY-MM-DD')])
      }
      res[moment(value.date).format('YYYY-MM-DD')].total += parseInt(value.total);
      return res;
    }, {});

    let gross_sales = result.concat(expense.map(item => ({
      date: moment(item.date).format('YYYY-MM-DD'),
      total: parseInt(item.total)
    })))

    let result2 = [];

    for (let { date, total } of gross_sales) {                             // iterate data, get x and y
      x = date.slice(0, 10);                                  // take yyyy-mm-dd only
      let temp = result2.find(q => q.date.slice(0, 10) === date); // look for same data
      if (temp) temp.total -= total;                               // if found add to y
      else result2.push({ date: date + 'T00:00:00.000Z', total });    // if not create object and push
    }


    res.json({
      message: 'success',
      data: result2,
      // data2: gross_sales
    })


  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/statistic/expense', checkToken, async function (req, res) {
  const id = getId({ req: req })
  try {

    let data = await expenseModels.find({ id_carts: id })

    res.json({
      message: 'success',
      data: data.map(item => ({
        id_expense: item._id,
        total: parseInt(item.total),
        id_merchant: item.id_carts,
        date: item.date,
        list_expense: item.list_expense.map(list => ({
          name_item: list.name_item,
          price: parseInt(list.price)
        }))
      }))
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.post('/statistic/expense/add', checkToken, async function (req, res) {
  const { list_expense, total } = req.body
  const id = getId({ req: req })
  let post = new expenseModels({
    total: total,
    list_expense: list_expense,
    id_carts: id
  })

  try {

    await post.save()

    res.json({
      message: 'success',
      data: 'berhasil membuat expense'
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/outlet_status', checkToken, async function (req, res) {
  const id = getId({ req: req })

  let outlet = await cartsModel.findOne({ _id: id })
  try {
    if (outlet.open === true) {
      await cartsModel.findOneAndUpdate({ _id: id }, {
        open: false
      }).then(hasil => {
        res.json({
          message: 'success',
          data: {
            outlet_status: false,
            pesan: 'outlet berhasil tutup'
          }
        })
      })

    }
    else if (outlet.open === false) {
      await cartsModel.findOneAndUpdate({ _id: id }, {
        open: true
      }).then(hasil => {
        res.json({
          message: 'success',
          data: {
            outlet_status: true,
            pesan: 'outlet berhasil buka'
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

router.get('/info', checkToken, async function (req, res) {
  const id = getId({ req: req })
  try {
    let data = await cartsModel.findOne({ _id: id })
    let order = await orderModel.find({ id_carts: id })
    let order_onsite = await orderOnsiteModel.find({ id_carts: id })

    let all_transaction = order.concat(order_onsite)

    res.json({
      message: 'success',
      data: {
        id_merchant: data._id,
        cart_detail: data.cart_detail,
        outlet_status: data.open,
        transaction: all_transaction.filter(date => `${moment(date.date).format('YYYY-MM-DD')}` === `${moment(new Date()).format('YYYY-MM-DD')}`).length,
        total: all_transaction.filter(date => `${moment(date.date).format('YYYY-MM-DD')}` === `${moment(new Date()).format('YYYY-MM-DD')}`).reduce((t, { total }) => t + parseInt(total), 0)

      }
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})

router.get('/statistic/sales', checkToken, async function (req, res) {

  const id = getId({ req: req })

  try {
    let order = await orderModel.find({ id_carts: id })
    let order_onsite = await orderOnsiteModel.find({ id_carts: id })
    let all_sales = order.concat(order_onsite)


    var result = [];
    all_sales.reduce(function (res, value) {
      if (!res[moment(value.date).format('YYYY-MM-DD')]) {
        res[moment(value.date).format('YYYY-MM-DD')] = { date: moment(value.date).format('YYYY-MM-DD'), total: 0 };
        result.push(res[moment(value.date).format('YYYY-MM-DD')])
      }
      res[moment(value.date).format('YYYY-MM-DD')].total += parseInt(value.total);
      return res;
    }, {});

    res.json({
      message: 'success',
      data: result.filter(date => `${moment(date.date).format('YYYY-MM-DD')}` !== `${moment(new Date()).format('YYYY-MM-DD')}`).sort((a, b) => new Date(b.date) - new Date(a.date))
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})


router.post('/order/createorder', checkToken, async function (req, res) {
  const { order_type, list_order, total, total_disc, payment_method } = req.body
  const id = getId({ req: req })

  let post = new orderOnsiteModel({
    order_type: order_type,
    list_order: list_order,
    total: total,
    total_disc: total_disc,
    payment_method: payment_method,
    invoice: `ONSITE-INVC${moment(new Date()).format('YYYYMMDDhhmmss')}-${id}`,
    id_carts: id,
    date: new Date()
  })

  try {


    await post.save()




    res.json({
      message: 'success',
      data: {
        // date: new Date(),
        invoice: `ONSITE-INVC${moment(new Date()).format('YYYYMMDDhhmmss')}-${id}`
      }
    })

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
    let product = await productModel.find()


    res.json({
      message: 'success',
      data: product.map(item => ({
        id_product: item._id,
        image_product: item.image_product,
        title_product: item.title_product,
        price_product: item.price_product,
        category: item.category,
        createdAt: item.createdAt
      }))
    })


  } catch (err) {
    res.json({
      message: 'error',
      data: []
    })
  }
})

router.get('/order/history/apps', checkToken, async function (req, res) {
  const id_merchant = getId({ req: req })

  try {

    let order = await orderModel.find({ id_carts: id_merchant, status: 'completed' })
    let user = await userModel.find()
    let product = await productModel.find()

    let data = order.sort(function (a, b) { return new Date(b.date) - new Date(a.date) }).map(item => ({
      id_order: item._id,
      date: item.date,
      customer_name: user.filter(id => `${id._id}` === `${item.id_user}`)[0].full_name,
      note: item.note,
      total: parseInt(item.total) - parseInt(item.total_disc),
      status: item.status,
      invoice: item.invoice,
      list_order: item.list_order.map(list_order => ({
        title_product: product.filter(product => `${product._id}` === `${list_order.id_product}`)[0].title_product,
        price_product: parseInt(list_order.price_product),
        qty: parseInt(list_order.qty),
        category: list_order.category
      })),
      antrian: item.antrian,
      total_disc: parseInt(item.total_disc)
    }))

    res.json({
      message: 'success',
      data: data
    })

  } catch (err) {
    res.json({
      messaage: 'error',
      data: err
    })
  }
})

router.post('/order/completed', checkToken, async function (req, res) {
  const { status, id_order } = req.body
  const id = getId({req : req})

  try {

    if (status === 'completed') {
      await orderModel.findOneAndUpdate({ _id: id_order, id_carts: id }, {
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

router.get('/order/ongoing', checkToken, async function (req, res) {
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
      total_disc : item.total_disc,
      antrian: item.antrian,
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
        // data: data,
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