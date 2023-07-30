const mongoose = require('mongoose')
const {Schema} = mongoose

const sellerUserSchema = new Schema({
    username: {
        type: String,
        unique: true, 
        required: true,
       },
    name: {
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
    country: {
        type: String,
        required: true
    },
    city: {
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
    companyName: {
        type: String,
        required: true,
        
    },
    seller: {
        type: String,
        required: true
    },
    
 }, { timestamps: true });
 
 
 
 module.exports = mongoose.model('SellerUser',sellerUserSchema,'sellerUsers')