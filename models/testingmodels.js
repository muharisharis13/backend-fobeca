const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')(mongoose)

const postSchema = mongoose.Schema({
  _id: { type: Number },
  nama: { type: String }
}, { _id: false });


postSchema.plugin(autoIncrement)
module.exports = mongoose.model('testing', postSchema)