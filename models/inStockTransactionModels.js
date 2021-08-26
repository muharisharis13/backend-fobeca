const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  id_stock: {
    type: Schema.Types.ObjectId,
    required: true
  },
  nama_item: {
    type: String,
    required: true
  },
  qty: {
    type: String,
    required: true
  },
  vom: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('inStockTransaction', PostSchema)