const mongoose = require('mongoose')
const {Schema} = mongoose

const submitProductSchema = new Schema({

    username: {
        type:String,
        required: true
        
    },
    product: {
        type:Array,
        required: true
    },
    productOwner: {
        type:String,
        required: true
    }
   
    
 }, { timestamps: true });
 
 
 
 module.exports = mongoose.model('CartProduct',submitProductSchema,'cartProducts')