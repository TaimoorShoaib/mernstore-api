const JWTService = require("../services/JWTservice");
require("dotenv").config();
const User = require("../models/user");
const userDTO =require('../dto/user')

const auth = async (req, res, next) => {
  // check if the  cookies have the refreah and access token
try {
    const { refreshToken, accessToken } = req.cookies;

    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
  
    // if have check verify them // store it in id
    let id;
    try {
      id = JWTService.verifyAccessToken(accessToken);
    } catch (error) {
      return next(error);
    }
    let user;
    try {
       // check if the payload id matches with the id in the user model
      user = await User.findOne({ _id: id });
    } catch (error) {
      return next(error);
    }
 
    
    next()

} catch (error) {
    return next(error)
}
 
 
};
module.exports = auth
