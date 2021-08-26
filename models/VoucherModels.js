const mongoose = require('mongoose')
const Schema = mongoose.Schema;


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
  },
  min_ammount: {
    type: String,
  },
  max_disc: {
    type: String,
  },
  list_user: {
    type: Array
  },
  percentage: {
    type: String,
  },
  category: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  list_product: [
    { type: String }
  ],
  free_item: {
    type: String
  }

})


module.exports = mongoose.model('voucher', PostSchema)