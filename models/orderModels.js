const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const postSchema = mongoose.Schema({
  id_user: {
    type: Schema.Types.ObjectId,
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
  id_carts: { type: Schema.Types.ObjectId, required: true }
  ,
  list_order: [
    {
      id_product: {
        type: Schema.Types.ObjectId,
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