const express = require('express');
const router = express.Router();
const in_stock=require('../stocks/in_stock')
const current_stock=require('../stocks/current_stock')
const out_stock=require('../stocks/out_stock')
router.use('/in_stock', in_stock);
router.use('/current_stock', current_stock);
router.use('/out_stock', out_stock);


module.exports = router;