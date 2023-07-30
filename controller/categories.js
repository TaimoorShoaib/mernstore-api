const Joi = require('joi')

const categoriesController={
    async kitchenItem (req,res,next){
        const kitchenItemSchema = Joi.object({
            type: Joi.string().required(),
          });
    }
}