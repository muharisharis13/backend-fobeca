const mongoose = require('mongoose')


const PostSchema = mongoose.Schema({
  image: {
    type: String
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String,
    required: true
  },
  min_ammount: {
    type: String,
    required: true
  },
  max_disc: {
    type: String,
    required: true
  },
  list_user: {
    type: Array
  },
  percentage: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('voucher', PostSchema)