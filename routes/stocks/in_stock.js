const express = require('express');
const inStockTransactionModels = require('../../models/inStockTransactionModels');
const router = express.Router();
const stockModels = require('../../models/stockModels');
const jwt_decode = require('jwt-decode')
const moment = require('moment');


function getId({ req }) {
    return jwt_decode(req.headers.authorization.split(" ")[1]).data._id

}

router.get('/history', async function (req, res) {
    const year = new Date().getFullYear()
    const { start = moment(new Date(year, 0, 1)).format('YYYY-MM-DD'), end = moment(new Date().setDate(new Date().getDate() + 1)).format('YYYY-MM-DD') } = req.query

    try {
        let data = await inStockTransactionModels.aggregate([
            {

                $match: {
                    "createdAt": {
                        $gte: moment(new Date(start).setDate(new Date(start).getDate() + 0)).toDate(),
                        $lte: moment(new Date(end).setDate(new Date(end).getDate() + 1)).toDate()
                    }
                }
            },
            {
                $lookup: {
                    from: "admins",
                    localField: "id_user",
                    foreignField: "_id",
                    as: "id_user"
                }
            },
            {
                $unwind: "$id_user"
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "id_stock",
                    foreignField: "_id",
                    as: "id_stock"
                }
            },
            {
                $unwind: "$id_stock"
            }
        ])

        res.json({
            message: 'success',
            data: data.map(item => ({
                id_transactionInStock: item._id,
                user_info: {
                    id_user: item.id_user._id,
                    username: item.id_user.username,
                },
                stock_info: {
                    id_stock: item.id_stock._id,
                    nama_item: item.id_stock.nama_item,
                    qty: item.qty,
                    vom: item.vom
                },
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }))
        })
    } catch (err) {
        res.json({
            message: 'error',
            data: err
        })
    }
})

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
    const { _getId } = req.params
    const { nama_item, qty, vom } = req.body

    const id_user = getId({ req: req })

    try {
        const data = await stockModels.updateOne({ _id: _getId }, {
            $set: {
                nama_item: nama_item,
                qty: qty,
                vom: vom,
            }
        })

        const post = new inStockTransactionModels({
            id_user: id_user,
            id_stock: _getId,
            nama_item: nama_item,
            qty: qty,
            vom: vom
        })

        const save = await post.save()

        res.json({
            message: "success",
            data: data,
            data_inStock: save
        })
    } catch (error) {
        res.status(500)
        res.json({ message: 'error', data: error })
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
