const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let AI = require('mongoose-auto-increment')
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
AI.initialize(mongoose.connection);

PostSchema.plugin(AI.plugin, 'transaction')
module.exports=mongoose.model('transaction', PostSchema);