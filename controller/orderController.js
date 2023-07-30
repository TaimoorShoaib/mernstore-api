const SubmitProduct = require('../models/submitProduct')
const Joi = require('joi')
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/


const orderController = {
  async getOrderById(req,res,next){
    try {
      const getByIdOrderSchema = Joi.object({
        id: Joi.string().regex(mongodbIdPattern).required(),
      });
      const { error } = getByIdOrderSchema.validate(req.params);
      if (error) {
        return next(error);
      }
  
      const userId = req.params.id;
      let order;
      try {
        order = await SubmitProduct.find({ productOwner: userId });
      } catch (error) {
        return next(error);
      }
  
      return res.status(200).json({ Order: order });
    } catch (error) {
      return next(error);
    }
  }, async getOrderByIdDetail(req,res,next){
    
    try {
      const getByIdOrderSchema = Joi.object({
        id:Joi.string().regex(mongodbIdPattern).required(), 
      })
      const {error} = getByIdOrderSchema.validate(req.params)
      if(error){
        return next(error)
      }
      const id = req.params.id
      let product
      try {
         product = await SubmitProduct.findOne({_id:id})
      } catch (error) {
        return next(error)
      }
      return res.status(200).json({Product:product})
    } catch (error) {
      return next(error)
    }
  },async deleteOrderById(req,res,next){
    
    try {
      const getByIdOrderSchema = Joi.object({
        id:Joi.string().regex(mongodbIdPattern).required(), 
      })
      const {error} = getByIdOrderSchema.validate(req.params)
      if(error){
        return next(error)
      }
      const id = req.params.id
      let product
      try {
         product = await SubmitProduct.deleteOne({_id:id})
      } catch (error) {
        return next(error)
      }
      return res.status(200).json({Product:product})
    } catch (error) {
      return next(error)
    }
  }
}
module.exports = orderController