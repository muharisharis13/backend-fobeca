const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('user_mobile', PostSchema)