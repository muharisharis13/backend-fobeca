
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    list_product: { type: Array },
    status:{
        type: Boolean,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default:Date.now(),
    },
    stock: [
        {
            id_stock: {
                type: Schema.Types.ObjectId,
                required: true
            },
            name_stock: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            uom: {
                type: String,
                required: true
            }
        }
    ],
    device_token: {
        type: String
    }


})


module.exports=mongoose.model('carts', PostSchema);