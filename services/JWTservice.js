const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/tokens')
require("dotenv").config();

class JWTService{
 //sign access token 
    static signAccessToken(payload,expiryTime){
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:expiryTime})
 }
 //sign refrsh token 
 static signRefreshToken(payload,expiryTime){
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:expiryTime})
 }
 //verify access Token
 static verifyAccessToken(token){
    return jwt.verify(token, process.env.SECRET_KEY)

 }
 //verify Refresh Token
 static verifyRefreshToken(token){
    return  jwt.verify(token, process.env.SECRET_KEY)

 }
 //store refresh token
 static async storeRefreshToken(token,userId){
    try {
        const newToken = new RefreshToken({
            token:token,
            userId:userId,
        })
        // store in the db
        await newToken.save()
    } catch (error) {
        return next(error)
    }
 }

}
module.exports = JWTService