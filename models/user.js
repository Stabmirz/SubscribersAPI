const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    website:{
        type:String,
        required: true
    },
    profileDate:{
        type:Date,
        required: true,
        default : Date.now
    }
})

module.exports = mongoose.model('User', userSchema);