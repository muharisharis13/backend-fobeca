const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    nama_item: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    vom: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
})
module.exports=mongoose.model('stock', PostSchema);