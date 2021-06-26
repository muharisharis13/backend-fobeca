const express = require('express');
const router = express.Router();
const stockModels = require('../../models/stockModels')
const transactionModels = require('../../models/transactionModels')
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    try {
        var data = await transactionModels.aggregate([
        {
            $lookup:
            {
                from: "couriers",
                localField: "couries_id",
                foreignField: "_id",
                as: "couries_id"
            },
        },

    ])

        // let data = await transactionModels.find()

        // var list_item = await stockModels.find({ _id: { $in: data.item_order } })
        
        // data.item_order = list_item;
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});




router.get('/:_getid', async (req, res) => {
    req.params._getid
    try {
        var data = await transactionModels.aggregate([
            { $match: { _id : mongoose.Types.ObjectId("60ac740470e53a00226fb034") } },
        {
            $lookup:
            {
                from: "couriers",
                localField: "couries_id",
                foreignField: "_id",
                as: "couries_id"
            },
        },
      
   
    ])
        

        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});




router.post('/', async (req, res) => {
    var temp=JSON.parse(req.body.item_order)
    const post = new transactionModels({
        carts_id: req.body.carts_id,
        carts_name:req.body.carts_name,
        couries_id: req.body.couries_id,
        item_order: temp,
        status: false
    })
    try {
    
     

        for(i=0;i<=temp.length-1;i++){
            console.log(i)
            console.log(temp[i].name)
            await stockModels.updateOne({ _id: temp[i]._id }, {
               $inc: {
                qty: - temp[i].qty,
               }})
       }
       
        const save = await post.save();
        res.json(save)

    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});
module.exports = router;




router.post('/:_getid', async (req, res) => {
    console.log(req.params._getid)
    try {
        const data = await transactionModels.updateOne({ _id: req.params._getid }, {
            $set: {
                status: req.body.status,
            }
        })
        res.json(data)

    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});
module.exports = router;