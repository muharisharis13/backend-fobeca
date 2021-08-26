const express = require('express');
const router = express.Router();
const stockModels = require('../../models/stockModels')
const transactionModels = require('../../models/transactionModels')
const mongoose = require('mongoose');
const moment = require('moment')


router.get('/', async (req, res) => {
    const year = new Date().getFullYear()
    // start = moment(new Date(year, 0, 1)).format('YYYY-MM-DD'),
    //     end = moment(new Date().setDate(new Date().getDate() + 1)).format('YYYY-MM-DD'),
    const {
        start = "",
        end = "",
        cart = ""
    } = req.query

    let temp = {}

    if (start && end && cart === "") {
        temp = {
            date: {
                $gte: moment(new Date(start).setDate(new Date(start).getDate() + 0)).toDate(),
                $lte: moment(new Date(end).setDate(new Date(end).getDate() + 1)).toDate()
            }
        }
    }
    else if (cart && start === "" && end === "") {
        temp = {
            carts_name: { $regex: `${cart}`, $options: "$i" }
        }
    }
    else if (cart && start && end) {
        temp = {
            date: {
                $gte: moment(new Date(start).setDate(new Date(start).getDate() + 0)).toDate(),
                $lte: moment(new Date(end).setDate(new Date(end).getDate() + 1)).toDate()
            },
            carts_name: { $regex: `${cart}`, $options: "$i" }
        }
    }

    try {
        var data = await transactionModels.aggregate([
            {

                $match: temp
            },
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

        // var data = await transactionModels.find(temp)

        res.json(data)

        // res.json({
        //     data: data,
        //     $gte: moment(new Date(start).setDate(new Date(start).getDate() + 0)).toDate(),
        //     $lte: moment(new Date(end).setDate(new Date(end).getDate() + 1)).toDate()
        // })
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});




router.get('/:_getid', async (req, res) => {
    req.params._getid
    try {
        var data = await transactionModels.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.params._getid) } },
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
        const data = await transactionModels.findOneAndUpdate({ _id: req.params._getid }, {
            status: req.body.status
        })
        res.json(data)

    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});
module.exports = router;