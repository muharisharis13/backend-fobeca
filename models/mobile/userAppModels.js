const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true
  },
  profile_photo: {
    type: String,
    default: ""
  },
  list_favorite: { type: Array },
  email: {
    type: String,
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  balance: {
    type: String,
    required: true
  },
  alamat: {
    type: String,
    default: ""
  },
  list_voucher: {
    type: Array
  },
  status: {
    type: String,
    required: true
  },
  device_token: {
    type: String
  }
})


PostSchema.methods.findSimilarType = function findSimilarType(cb) {
  return this.model('user_mobile').find({ type: this.type }, cb)
}

module.exports = mongoose.model('user_mobile', PostSchema)