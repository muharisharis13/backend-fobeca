const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  id_user: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  lat: {
    type: String,
    required: true
  },
  long: {
    type: String,
    required: true
  },
  list_order: [
    {
      id_product: {
        type: String,
        required: true
      },
      price_product: {
        type: String,
        required: true
      },
      qty: {
        type: String,
        required: true
      }
    }
  ],
  total: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('order', postSchema)