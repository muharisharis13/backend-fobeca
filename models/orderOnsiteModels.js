const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const postSchema = mongoose.Schema({
  order_type: {
    type: String,
    required: true
  },
  list_order: [
    {
      id_product: { type: String, required: true },
      qty: { type: String, required: true },
      price: { type: String, required: true }
    }
  ],
  total: {
    type: String,
    required: true
  },
  total_disc: {
    type: String,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  invoice: {
    type: String,
    unique: true,
    required: true
  },
  id_carts: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('order_onsite', postSchema)