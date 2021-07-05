const mongoose = require('mongoose')
let AI = require('mongoose-auto-increment')


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
  favorite_product: { type: Array },
  price_product: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
AI.initialize(mongoose.connection);

PostSchema.plugin(AI.plugin, 'Product')

module.exports = mongoose.model('Product', PostSchema)