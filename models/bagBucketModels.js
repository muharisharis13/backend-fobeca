const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bagBucket = mongoose.Schema({
  id_user: {
    type: String,
    required: true
  },
  id_product: {
    type: String,
    required: true
  },
  qty: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('bagBucket', bagBucket)