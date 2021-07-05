const mongoose = require('mongoose');
let AI = require('mongoose-auto-increment')


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

AI.initialize(mongoose.connection);

PostSchema.plugin(AI.plugin, 'couriers')

module.exports=mongoose.model('couriers', PostSchema);