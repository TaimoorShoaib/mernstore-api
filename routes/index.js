const express = require('express');
const router = express.Router()
const productController =require('../controller/productController')
const authController = require('../controller/authController')
const reviewController = require('../controller/reviewController')
const orderController = require('../controller/orderController')
const cartController = require('../controller/cartController')
const auth = require('../middleware/auth')

router.get('/test', (req, res) => {
    res.send('test Working');
  });

// authentication Contrller
  // user register
  router.post('/register',authController.register)
  // seller register
  router.post('/registerseller',authController.registerSeller)
  // login
  router.post('/login',authController.login)
  //logout
  router.post('/logout',auth,authController.logout)

// Product Crontroller 
 //create product
 router.post('/product/create',auth,productController.create)
  // get all products
  router.get('/products',productController.getAllProducts)
 //delete product
 router.delete('/product/:id',auth,productController.delete)
 //update
 router.put('/product',auth,productController.update)
  // get products by id
 router.get('/product/:id',auth,productController.getById)
   //  submitProducts 
   router.post('/product/submit/:id',auth,productController.submitProduct)
   //  submit Number Of Products 
   router.post('/product/number/amount',auth,productController.numberOfProduct)
  
  //  submit Number Of Products  Cart
  router.post('/product/cart/number/amount',auth,cartController.numberOfProductCart)
   // reiviews controlller 
    
  router.post('/comment',auth,reviewController.create)

  router.get('/comment/:id',auth,reviewController.getById)

 //  orders 
 router.get('/owner/order/:id',auth,orderController.getOrderById)
 //order detail
 router.get('/owner/order/detail/:id',auth,orderController.getOrderByIdDetail)
// delete Order 
router.delete('/owner/order/detail/delete/:id',auth,orderController.deleteOrderById)

// cart 
router.post('/user/product/cart',auth,cartController.putInCartProducts)
// get all products  in cart
router.get('/user/product/cart/:id',auth,cartController.getAllCartProducts)
// submit cart products
router.post('/user/product/cart/buy', auth, cartController.buy);
// remove cart products
router.delete('/user/product/cart/:id', auth, cartController.removeCartProduct);


  module.exports = router