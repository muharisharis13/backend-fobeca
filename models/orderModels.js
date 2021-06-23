const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
  id_user: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  invoice: {
    type: String,
    unique: true,
    required: true
  },
  // lat: {
  //   type: String,
  //   required: true
  // },
  // long: {
  //   type: String,
  //   required: true
  // },
  id_carts: { type: String, required: true }
  ,
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
      category: {
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
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('order', postSchema)