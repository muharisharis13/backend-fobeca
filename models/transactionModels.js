const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = mongoose.Schema({
    carts_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    carts_name: {
        type: String,
        required: true
    },
    couries_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    
    item_order: {
        type: [],
        required: true
    },
    status:{
        type:Boolean,
        required: true
    },
    date: {
        type: Date,
        default:Date.now(),
    },
})
module.exports=mongoose.model('transaction', PostSchema);