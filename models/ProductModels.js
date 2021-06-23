const mongoose = require('mongoose')


const PostSchema = mongoose.Schema({
  image_product: {
    type: String,
    required: true
  },
  title_product: {
    type: String,
    required: true
  },
  desc_product: {
    type: String,
    required: true
  },
  favorite_product: {
    type: String
  },
  price_product: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Product', PostSchema)