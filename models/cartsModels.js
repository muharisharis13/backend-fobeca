const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const PostSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    carts_info: {
        phone_number:{
            type:String,
            required: true,
            unique: true
        },
        identity_card:{
            type:String,
            required: true
        },
        photo:{
            type: String,
            required: true
        },
    },
    cart_detail: {
        cart_name:{
            type:String,
            required: true
        },
        address:{
            type:String,
            required: true
        },
        long:{
            type: String,
            required: true
        },
        lat:{
            type: String,
            required: true
        },
    },
    status:{
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default:Date.now(),
    },


})

autoIncrement.initialize(mongoose.connection);

PostSchema.plugin(autoIncrement.plugin, 'carts');

module.exports=mongoose.model('carts', PostSchema);