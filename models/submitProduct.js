const mongoose = require('mongoose')
const {Schema} = mongoose

const submitProductSchema = new Schema({

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
        required: true
    },
    product: {
        type:Array,
        required: true
    },
    productOwner: {
        type: Schema.Types.ObjectId,
        ref:'SellerUser',

 
    }
   
    
 }, { timestamps: true });
 
 
 
 module.exports = mongoose.model('SubmitProduct',submitProductSchema,'submitProducts')