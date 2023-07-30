const mongoose = require('mongoose')
const {Schema} = mongoose

const submitCartProductSchema = new Schema({

    username: {
        type:Array,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    numOfProduct: {
        type: Number,
     
    },
  
    productOwner: {
        type:String,
        required: true
    }
   
    
 }, { timestamps: true });
 
 
 
 module.exports = mongoose.model('SubmitCartProduct',submitCartProductSchema,'submitCartProducts')