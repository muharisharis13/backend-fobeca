const mongoose = require('mongoose');

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
        required: true
    },
    carts_info: new mongoose.Schema({
        phone_number:{
            type:String,
            required: true
        },
        identity_card:{
            type:String,
            required: true
        },
        photo:{
            type: String,
            required: true
        },
    }),
    cart_detail: new mongoose.Schema({
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
    }),
    status:{
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default:Date.now(),
    },
    // balance: {
    //     type: String,
    //     default: 0
    // },
    // deposit: {
    //     type: String,
    //     default: 0
    // }

})
module.exports=mongoose.model('carts', PostSchema);