const mongoose = require('mongoose');
let AI = require('mongoose-auto-increment')

const PostSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: true
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

AI.initialize(mongoose.connection);

PostSchema.plugin(AI.plugin, 'user_account')
module.exports=mongoose.model('user_account', PostSchema);