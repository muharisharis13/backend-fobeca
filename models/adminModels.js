const mongoose = require('mongoose')


const adminModels = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  admin_info: {
    ktp: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: true,
      unique: true
    }
  }
})

module.exports = mongoose.model('admin', adminModels)