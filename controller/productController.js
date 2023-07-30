const Product = require('../models/product')
const Joi = require('joi')
const productDTO = require('../dto/product')
const SubmitProduct = require('../models/submitProduct')
const User =require('../models/user')
const Review = require('../models/review')
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/
const fs = require('fs')
const SellerUser = require('../models/sellerUser')
const nodemailer = require('nodemailer');
const NumberOfProduct = require('../models/numberOfProduct')
require("dotenv").config();

const productController={
    async create(req,res,next){
         try {
            // validate
            const createProductSchema = Joi.object({
                owner:Joi.string().regex(mongodbIdPattern).required(),
                photo: Joi.string().required(),
                productName: Joi.string().max(30).required(),
                price: Joi.string().required(),
                numOfProduct: Joi.number().required(),
                type:Joi.string().required(),
                decs: Joi.string().required(),
            })
            const {error}=createProductSchema.validate(req.body)

            if(error){
                return next(error)
            }

            
               const {owner,photo,productName,price,decs,numOfProduct,type} = req.body
                 
               // read buffer 
              const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64')

               //give image a name 
             const imagePath = `${Date.now()}-${owner}.png`

             //save it locally
             try {
                fs.writeFileSync(`storage/${imagePath}`,buffer)
             } catch (error) {
                return next(error)
             }


               let newProduct;
               try {
                newProduct = new Product({
                    owner,
                    photoPath:`${process.env.BACKEND_SERVER_PATH}/storage/${imagePath}`,
                    productName,
                    price,
                    decs,
                    numOfProduct,
                    productSold:0,
                    type,
                }) 
                await newProduct.save()
               } catch (error) {
                return next(error)
               }
               
               return res.status(201).json({product:newProduct})

         } catch (error) {
            return next(error)
         }
    } ,async getAllProducts(req,res,next){
         
        
        try {
            const products = await Product.find({}).populate('owner')
            const productDto=[] 
            for(let i = 0 ; i < products.length; i++ ){
              const  dto = new productDTO(products[i])
              productDto.push(dto)
            }
            return res.status(200).json({product:productDto})
          } catch (error) {
            return next(error)
          }
          
    } ,async delete(req,res,next){
        
        const deleteBlogSchema = Joi.object({
            id:Joi.string().regex(mongodbIdPattern).required()
           })
           const {error}=deleteBlogSchema.validate(req.params)
           if(error){
            return next(error)
           }
        
        let id = req.params.id
        try {
            await Product.deleteOne({_id:id}) 
            await Review.deleteOne({product:id}) 
        } catch (error) {
            return next(error)
        }
        res.status(200).json({message:"done"})
    },async update(req,res,next){
             // validate 
        const updateBlogSchema = Joi.object({
            productName:Joi.string(),
            decs:Joi.string(),
            price:Joi.string(),
            owner:Joi.string().regex(mongodbIdPattern).required(),
            numOfProduct: Joi.number().required(),
            productId:Joi.string().regex(mongodbIdPattern).required(),
            photo:Joi.string() 
   
           })
           const {error} = updateBlogSchema.validate(req.body)
          if(error){
            return next(error)
          }
          const {productName,decs,price,owner,productId,photo,numOfProduct} = req.body

          let product
          try {
            product = await Product.findOne({_id:productId})
          } catch (error) {
            return next(error)
          }
          
          if(photo){
            let previousPhoto = product.photoPath

           
                previousPhoto = previousPhoto.split('/').at(-1);
                // delete the previous photo
                fs.unlinkSync(`storage/${previousPhoto}`);
              
              
         // read the buffer 
         const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64')
             
         //give i a name 
         const imagePath = `${Date.now()}-${owner}.png`
         // save it locally
         try {
            fs.writeFileSync(`storage/${imagePath}`,buffer)
         } catch (error) {
            return next(error)
         }
             await Product.updateOne({_id:productId},
                {productName,decs,price,numOfProduct,photoPath:`${process.env.BACKEND_SERVER_PATH}/storage/${imagePath}`}
                )
          }else{
            await Product.updateOne({_id:productId},
                {productName,decs,price,numOfProduct}
                )

          }
          return res.status(200).json({message:'blog updated!'})
    },async getById(req,res,next){
             try {
               // validate 
               const getByIdSchema = Joi.object({
                id: Joi.string().regex(mongodbIdPattern).required(),
              });
              const { error } = getByIdSchema.validate(req.params);
              if (error) {
                return next(error);
              }
              const {id} = req.params
              let product
              try {
                product = await Product.findOne({_id:id}).populate('owner')
              } catch (error) {
                return next(error)
              }
              const productDto = new productDTO(product)

              return res.status(200).json({product:productDto})

           } catch (error) {
            return next(error)
           }
    },async submitProduct(req, res, next) {
      try {
        // validate
        const updateProductSchema = Joi.object({
          country: Joi.string().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
          zipCode: Joi.string().required(),
          phoneNumber: Joi.string().required(),
          usernameId: Joi.string().regex(mongodbIdPattern).required(),
          productId: Joi.string().regex(mongodbIdPattern).required(),
        });
        const { error } = updateProductSchema.validate(req.body);
        if (error) {
          return next(error);
        }
        const { country, city, address, zipCode, phoneNumber, usernameId, productId } = req.body;
    
        let info;
        const user = await User.findOne({ _id: usernameId });
        const product = await Product.findOne({ _id: productId });
        const productOwner = await SellerUser.findOne({ _id: product.owner });
        
        try {
          const numberOfProduct = await NumberOfProduct.findOne({
            productId: productId,
            userId: usernameId,
          });
          let numOfProductfix = 1;
          if (numberOfProduct) {
            numOfProductfix = numberOfProduct.numOfProduct;
          }
    
          const SubmitProductToRegister = new SubmitProduct({
            country,
            city,
            address,
            zipCode,
            phoneNumber,
            username: [user],
            product: [product],
            productOwner: productOwner._id,
            numOfProduct: numOfProductfix,
          });
    
          info = await SubmitProductToRegister.save();
    
          // Update the numOfProduct in the Product model
          await Product.updateOne(
            { _id: productId },
            { $inc: { numOfProduct: -numOfProductfix } }
          );
          await Product.updateOne(
            { _id: productId },
            { $inc: { productSold: +numOfProductfix } }
          )
    
          // Delete the NumberOfProduct entry
          await NumberOfProduct.deleteOne({ _id: numberOfProduct._id });
        } catch (error) {
          console.log(error);
        }
    
        return res.status(200).json({ info: info });
      } catch (error) {
        return next(error);
      }
    }
    , async numberOfProduct(req,res,next){
    
      try {
        const numberOfProductSchema = Joi.object({
          productId:Joi.string().regex(mongodbIdPattern).required(), 
          userId:Joi.string().regex(mongodbIdPattern).required(), 
          numOfProduct:Joi.number().required(), 
        })
        const {error} = numberOfProductSchema.validate(req.body)
        if(error){
          return next(error)
        }
        const {productId,numOfProduct,userId} = req.body
        let data ;
        try {
          const alreadyData1 = await NumberOfProduct.findOne({productId:productId})
          const alreadyData2 = await NumberOfProduct.findOne({userId:userId})
          if(alreadyData2 && alreadyData1){
            
            await NumberOfProduct.updateOne({productId:productId},
                {userId,productId,numOfProduct}
              )
            
          }else {
           
            data = new NumberOfProduct({
              productId:productId,
            userId:userId,
            numOfProduct:numOfProduct
           })
           await data.save()
          }
          
        } catch (error) {
          return next(error)
        }
        return res.status(200).json({message:"ok"})
      } catch (error) {
        return next(error)
      }
    }
}

 module.exports=productController

 