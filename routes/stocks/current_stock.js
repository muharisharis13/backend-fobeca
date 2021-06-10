const express = require('express');
const router = express.Router();
const stockModels = require('../../models/stockModels')


//in stock
router.get('/', async (req, res) => {
    try {
        var data = await stockModels.find({'status':true})
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});



module.exports = router;