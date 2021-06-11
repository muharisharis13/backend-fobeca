const express = require('express');
const router = express.Router();
const stock_route=require('../routes/stocks/stock')
const couriers_route=require('../routes/couriers/couriers')
const purchasing_route=require('../routes/purchasing/purchasing')
const cart_route=require('../routes/carts/cart')
const login_register=require('../routes/login_register/login_register')
const fs = require('fs')

router.use('/stock', stock_route);
router.use('/couriers', couriers_route);
router.use('/purchasing', purchasing_route);
router.use('/carts', cart_route);
router.use('/login_register', login_register);
router.get('/view_ktp/:namaImage', function (req, res) {
    const { namaImage } = req.params

    fs.readFile(`./uploads/ktp/${namaImage}`, (err, data) => {
        res.writeHead(200, {
            'Content-type': 'image/jpeg'
        })
        res.end(data)
    })
})
router.get('/view_photo/:namaImage', function (req, res) {
    const { namaImage } = req.params

    fs.readFile(`./uploads/photo/${namaImage}`, (err, data) => {
        res.writeHead(200, {
            'Content-type': 'image/jpeg'
        })
        res.end(data)
    })
})
router.get('/', function(req, res){
    res.write('<h1>Hello world</h1>')
})

module.exports=router;