const mongoose = require('mongoose')
let AI = require('mongoose-auto-increment')

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
AI.initialize(mongoose.connection);

postSchema.plugin(AI.plugin, 'message')

module.exports = mongoose.model('message', postSchema)