const Joi = require('joi')
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const bcrypt = require('bcryptjs')
const User =require('../models/user')
const userDTO = require('../dto/user')
const SellerUser = require('../models/sellerUser')
const JWTService = require('../services/JWTservice')
const RefreshToken = require('../models/tokens')
const nodemailer = require("nodemailer");

const authController={
    async register(req,res,next){
       try {
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref("password"),
          });
          const { error } = userRegisterSchema.validate(req.body);
      
          
          if (error) {
            return next(error)
          }

          const { username, name, email, password } = req.body;

          //hash password 
           const hashedPassword = await bcrypt.hash(password,10)
            let accessToken;
            let refreshToken;
           let user ;
           
         try {
            const userToRegister = new User({
               username,
               name,
               email,
               password:hashedPassword 
            })
            user= await userToRegister.save()
            // token generation 
            accessToken = JWTService.signAccessToken({_id:user._id},'30m')
            refreshToken = JWTService.signRefreshToken({_id:user._id},'60m')
         } catch (err) {
            const error = {
                status: 409,
                message: "UserName , Email or phoneNumber not available, choose another data!",
              };
              return next(error)
         }
           // store refresh token 
           await JWTService.storeRefreshToken(refreshToken,user._id)
         // send access token to cookeis
         res.cookie(`accessToken`,accessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
         })
         // send refresh token to cookeis
         res.cookie(`refreshToken`,refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
         })
         
         const userDto =new userDTO(user)
         return(
            res.status(201).json({user:userDto,auth:true})
         )
       } catch (err) {
         const error = {
            status: 409,
            message: "UserName , Email or phoneNumber not available, choose another data!",
          };
          return next(error);
       }
    },
    async registerSeller(req,res,next){
      try {
       const userRegisterSchema = Joi.object({
           username: Joi.string().min(5).max(30).required(),
           name: Joi.string().max(30).required(),
           email: Joi.string().email().required(),
           password: Joi.string().pattern(passwordPattern).required(),
           confirmPassword: Joi.ref("password"),
           country:Joi.string().required(),
           city:Joi.string().required(),
           zipCode:Joi.string().required(),
           phoneNumber:Joi.string().required(),
           companyName: Joi.string().min(5).max(25).required()
         });
         const { error } = userRegisterSchema.validate(req.body);
     
         // 2. if error in validation -> return error via middleware
         if (error) {
           return next(error)
         }

         const { username, name, email, password ,country ,city,zipCode ,phoneNumber,companyName} = req.body;

         //hash password 
          const hashedPassword = await bcrypt.hash(password,10)
           let accessToken
           let refreshToken
          let user ;
        try {
           const userToRegister = new SellerUser({
              username,
              name,
              email,
              password:hashedPassword ,
              country,
              city,
              zipCode,
              phoneNumber ,
              companyName,
              seller:true


           })
           user= await userToRegister.save()
            
           // token generation 

           accessToken = JWTService.signAccessToken({_id:user._id},'30m')
           refreshToken = JWTService.signRefreshToken({_id:user._id},'60m')
           
        } catch (err) {
           const error = {
               status: 409,
               message: "UserName, Email or phoneNumber not available, choose another data!",
             };
             return next(error)
        }
        // store refresh token 
        await JWTService.storeRefreshToken(refreshToken,user._id)

        // send access token to cookies
         res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
         })
         res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
         })

        const userDto =new userDTO(user)
        return(
           res.status(201).json({user:userDto,auth:true})
        )
      } catch (err) {
        const error = {
           status: 409,
           message: "UserName , Email or phoneNumber not available, choose another data!",
         };
         return next(error);
      }
   },
    async login(req,res,next){
      const userLoginSchema = Joi.object({
         email: Joi.string().min(5).email().required(),
         password: Joi.string().pattern(passwordPattern).required(),
       });
       const { error } = userLoginSchema.validate(req.body);
     
       // 2. if error in validation -> return error via middleware
       if (error) {
         return next(error);
       }
        
       try {
         const email =req.body.email
         const password =req.body.password
          
         const sellerUser = await SellerUser.findOne({email:email})
         const user =await User.findOne({email:email})
         
           
          if(sellerUser){
            const isMatch = await bcrypt.compare(password,sellerUser.password)
            if(isMatch){
                  // token generation 
       
            const accessToken = JWTService.signAccessToken({_id:sellerUser._id},'30m')
            const refreshToken = JWTService.signRefreshToken({_id:sellerUser._id},'60m')
            
            // update refresh token 
            try {
                
                await RefreshToken.updateOne({_id:sellerUser._id},
                  {token:refreshToken},
                  {upsert:true}
                  )
             } catch (error) {
               console.log(error)
             }

             res.cookie('accessToken',accessToken,{
               maxAge:1000*60*60*24,
               httpOnly:true
             })
             res.cookie('refreshToken',refreshToken,{
               maxAge:1000*60*60*24,
               httpOnly:true
             })
               
               
               const userDto =  new userDTO(sellerUser)
               res.status(200).json({user:userDto,auth:true})
            }else{
               res.status(400).json({message:"Invalid Credential"})
            }
         }
         else if(user){
          const isMatch = await bcrypt.compare(password, user.password); //  
             if(isMatch){

               // token generation 
       
            const accessToken = JWTService.signAccessToken({_id:user._id},'30m')
            const refreshToken = JWTService.signRefreshToken({_id:user._id},'60m')
            
            // update refresh token 
            try {
                
                await RefreshToken.updateOne({_id:user._id},
                  {token:refreshToken},
                  {upsert:true}
                  )
             } catch (error) {
               return next(error)
             }

             res.cookie('accessToken',accessToken,{
               maxAge:1000*60*60*24,
               httpOnly:true
             })
             res.cookie('refreshToken',refreshToken,{
               maxAge:1000*60*60*24,
               httpOnly:true
             })
               
               const userDto =  new userDTO(user)
               res.status(200).json({user:userDto,auth:true})
             }else{
               res.status(400).json({message:"Invalid Credential"})
             }
         }else{
            res.status(400).json({message:"Invalid Credential"})
         }
        
         
       } catch (error) {
         return next(error)
       }
    },async logout(req,res,next){
        // delete refresh token 
        const refreshToken = req.cookies.refreshToken
        try {
          await RefreshToken.deleteOne({token:refreshToken})
        } catch (error) {
          return next(error)
        }
        res.clearCookie(`accessToken`)
        res.clearCookie(`refreshToken`)
        // send response

         res.status(200).json({user:null,auth:false})
        
    }

}
module.exports = authController