const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  list_expense: {
    type: Array,
    required: true
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

module.exports = mongoose.model('expense', postSchema)