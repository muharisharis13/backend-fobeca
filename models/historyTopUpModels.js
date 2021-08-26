const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  phone_number: {
    type: Number,
    required: true
  },
  // id_user: {
  //   type: String,
  //   required: true
  // },
  id_carts: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('historyTopUp', PostSchema)