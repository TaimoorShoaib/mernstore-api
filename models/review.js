const mongoose = require('mongoose')
const {Schema} = mongoose

const reviewSchema = new Schema({
    
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    content: {
        type: String,
    },
    rating: {
        type: Number,
    },
    
 }, { timestamps: true });
 
 
 
 module.exports = mongoose.model('Review',reviewSchema,'reviews')