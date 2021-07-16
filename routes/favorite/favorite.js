const express = require('express')
const router = express.Router()
const usermobileModels = require('../../models/mobile/userAppModels')
const productModels = require('../../models/ProductModels')




router.get('/', async function (req, res) {
  const { id_user } = req.query
  let product
  let data
  try {
    await usermobileModels.findOne({ _id: id_user }).then(async (res) => {
      await productModels.find({ _id: res.list_favorite.map(item => item) }).then(res => product = res)
      data = res
    })

    res.json({
      message: 'success',
      data: {
        _id: data._id,
        createdAt: data.createdAt,
        email: data.email,
        phone_number: data.phone_number,
        list_favorites: product.map(item => ({
          title_product: item.title_product,
          image_product: item.image_product,
          desc_product: item.desc_product,
          price_product: item.price_product,
          category: item.category,
        }))
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'error',
      data: err
    })
  }
})

module.exports = router