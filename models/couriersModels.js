const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    courier_info:new mongoose.Schema({
        email:{
            type:String,
            required: true
        },
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
    status:{
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default:Date.now(),
    },
})
module.exports=mongoose.model('couriers', PostSchema);