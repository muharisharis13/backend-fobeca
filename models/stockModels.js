const mongoose = require('mongoose');
let AI = require('mongoose-auto-increment')

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

AI.initialize(mongoose.connection);

PostSchema.plugin(AI.plugin, 'stock')
module.exports=mongoose.model('stock', PostSchema);