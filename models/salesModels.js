const mongoose = require("mongoose");
const Schema = mongoose.Schema


const postSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  total: {
    type: String,
    required: true
  },
  id_carts: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('sales', postSchema)