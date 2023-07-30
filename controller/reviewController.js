const mongodbIdPattern = /^[0-9a-fA-F]{24}$/
const Joi = require('joi')
const Review = require('../models/review')
const reviewDTO = require('../dto/review')
const reviewController ={
  async create(req,res,next){
    const createReviewSchema = Joi.object({
      content:Joi.string(),
      rating:Joi.number().min(0).max(5),
      product:Joi.string().regex(mongodbIdPattern).required(),
      author:Joi.string().regex(mongodbIdPattern).required(),      
     })
     const {error} = createReviewSchema.validate(req.body)
    if(error){
      return next(error)
    }
    const {content,product,author,rating}=req.body
  let review
    try {
     const reviewToRegister = new Review({
      content,
      rating,
      product,
      author
     })
     review = reviewToRegister.save()
  } catch (error) {
    return next(error)
  }
  return res.status(200).json({message:"review created"})

  } ,
  async getById(req,res,next){
    const getByIdReviewSchema = Joi.object({
      id:Joi.string().regex(mongodbIdPattern).required(), 
    })
     const {error} = getByIdReviewSchema.validate(req.params)
    if(error){
      return next(error)
    }
    let id = req.params.id
    let review
  try {
     review = await Review.find({product:id}).populate('author')

     
  } catch (error) {
    return next(error)
  }
  const reviewDto =[]
 for(let i = 0 ; i < review.length ; i++  ){
  const data = new reviewDTO(review[i])
  reviewDto.push(data)
 }

  return res.status(200).json({Review:reviewDto})
  }
}
module.exports = reviewController