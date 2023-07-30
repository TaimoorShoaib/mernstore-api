const mongoose = require('mongoose')
const {Schema} = mongoose

const numberOfProductSchema = new Schema({

    productId: {
     type: mongoose.Schema.Types.ObjectId,
     ref:'Product'

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
   
       },
    numOfProduct: {
        type: Number,
        required: true
    },
  
    
 }, { timestamps: true });
 
 
 
 module.exports = mongoose.model('NumberOfProduct',numberOfProductSchema,'numberOfProducts')