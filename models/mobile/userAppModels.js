const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true
  },
  list_favorite: { type: Array },
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
  balance: {
    type: String,
    required: true
  },
  alamat: {
    type: String
  },
  status: {
    type: String,
    required: true
  }
})


PostSchema.methods.findSimilarType = function findSimilarType(cb) {
  return this.model('user_mobile').find({ type: this.type }, cb)
}

module.exports = mongoose.model('user_mobile', PostSchema)