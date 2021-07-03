const mongoose = require('mongoose');
const moment = require('moment')

const PostSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: `CARTS${moment(Date.now()).format('YYYYMMDDhhmmsst')}`,
        unique: true
    },
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
module.exports=mongoose.model('carts', PostSchema);