const express = require('express')
const router = express.Router()
const jwt_decode = require('jwt-decode')
const cartsModels = require('../../../models/cartsModels')
const ProductModels = require('../../../models/ProductModels')




function getId({ req }) {
  return jwt_decode(req.headers.authorization.split(" ")[1]).data._id
}

router.post('/pushProduct', async function (req, res) {
  const { id_product, id_merchant } = req.body

  try {
    await cartsModels.findOneAndUpdate({ _id: id_merchant }, {
      $push: { list_product: `${id_product}` }
    }).then(hasil => {
      res.json({
        message: 'success',
        data: hasil
      })
    })

  } catch (err) {
    res.json({
      message: 'error',
      data: err
    })
  }
})