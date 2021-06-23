const express = require('express');
const router = express.Router();
const stock_route=require('../routes/stocks/stock')
const couriers_route=require('../routes/couriers/couriers')
const purchasing_route=require('../routes/purchasing/purchasing')
const cart_route=require('../routes/carts/cart')
const login_register=require('../routes/login_register/login_register')
const order_route = require('../routes/transaction/order/order')
const product_route = require('../routes/product/product')
const useraccount_route = require('../routes/MobileApp/login_register/login_register')
const merchant_routes = require('../routes/merchant/merchant')

router.use('/stock', stock_route);
router.use('/couriers', couriers_route);
router.use('/purchasing', purchasing_route);
router.use('/carts', cart_route);
router.use('/products', product_route);
router.use('/login_register', login_register);



// mobile
router.use('/orders', order_route);
router.use('/users', useraccount_route)
router.use('/merchants', merchant_routes)




router.get('/', function(req, res){
    res.write('<h1>Hello world</h1>')
})

module.exports=router;