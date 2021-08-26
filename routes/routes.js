const express = require('express');
const router = express.Router();
const stock_route=require('../routes/stocks/stock')
const couriers_route=require('../routes/couriers/couriers')
const purchasing_route=require('../routes/purchasing/purchasing')
const cart_route=require('../routes/carts/cart')
const login_register=require('../routes/login_register/login_register')
const order_route = require('../routes/transaction/order/order')
const product_route = require('../routes/product/product')
const useraccount_route = require('./MobileApp/user/user')
const merchant_routes = require('./MobileApp/merchant/merchant')

const message_routes = require('../routes/message/message')
const favorite_routes = require('../routes/favorite/favorite')
const spv_routes = require('../routes/webApp/SPV/spv')

const voucher_routes = require('../routes/voucher/voucher')
const superadmin_routes = require('../routes/webApp/superAdmin/SuperAdmin')
const test_routes = require('../routes/testing/index')



router.use('/stock', stock_route);
router.use('/couriers', couriers_route);
router.use('/purchasing', purchasing_route);
router.use('/carts', cart_route);
router.use('/products', product_route);
router.use('/login_register', login_register);

// router.use('/spv', spv_routes)



// mobile
router.use('/orders', order_route);
router.use('/users', useraccount_route)
router.use('/merchants', merchant_routes)
router.use('/messages', message_routes)
router.use('/favorites', favorite_routes)
router.use('/vouchers', voucher_routes)


// super admin

router.use('/adm', superadmin_routes)

router.use('/test', test_routes)




router.get('/', function(req, res){
    res.write('<h1>Hello world</h1>')
})

module.exports=router;