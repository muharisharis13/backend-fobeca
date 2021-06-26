const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  image: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: Boolean, required: true }
})

module.exports = mongoose.model('message', postSchema)