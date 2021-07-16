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


router.post('/', async (req, res) => {
    const post = new stockModels({
        nama_item: req.body.nama_item,
        qty: req.body.qty,
        vom:req.body.vom,
        status:true
    })
    try {
        const save = await post.save();
        res.json(save)

    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});


router.post('/:_getId', async (req, res) => {
    try {
        const data = await stockModels.updateOne({ _id: req.params._getId }, {
            $set: {
                nama_item: req.body.nama_item,
                qty: req.body.qty,
                vom:req.body.vom,
            }
        })
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
})

router.delete('/:_getId', async (req, res) => {
    try {
        const data = await stockModels.updateOne({ _id: req.params._getId }, {
            $set: {
                status: false,
            }
        })
        res.json(data)
    } catch (error) {
         res.status(500)
        res.json({ message: error })
    }
})


module.exports = router;
