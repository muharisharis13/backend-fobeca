const express = require('express');
const router = express.Router();
const couriersModels = require('../../models/couriersModels')
const Formidable = require('formidable')

router.get('/', async (req, res) => {
    try {
    //     var data = await couriersModels.aggregate([{$match:{ 'status': true },},
    //   { $project: {
    //     date: "$date",
    //     full_name:"$full_name",
    //     courier_info: {
    //         _id: "$courier_info._id",
    //         email:"$courier_info.email",
    //         phone_number:" $courier_info.phone_number",
    //         identity_card:  { $concat: [ process.env.WEB_URL,"uploads/ktp/",  "$courier_info.identity_card" ] },
    //         photo: { $concat: [ process.env.WEB_URL,"uploads/photo/",  "$courier_info.photo" ] }
    //     },
    //     status:"$status",  
        
    //     } }
    // ])

    var data = await couriersModels.find({'status':true})
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});



router.post('/', async function (req, res) {
    try {
        if (req.files) {
            const photo = req.files.photo
            const photoName = photo.name
            const identity = req.files.identity
            const identityName = identity.name

            await photo.mv(`./uploads/photo/${photoName}`);
            await identity.mv(`./uploads/ktp/${identityName}`);

            const post = new couriersModels({
                full_name: req.body.full_name,
                courier_info: {
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    identity_card: identityName,
                    photo: photoName
                },
                status: true
            })
            const save = await post.save();
            res.json(save)
        }
        else {
            res.send('There are no files')
        }
    } catch (err) {
        res.status(500)
        res.json({ message: error })
    }
})

router.post('/:_getid', async (req, res) => {
    try {
        if (req.files) {
            const photo = req.files.photo
            const photoName = photo.name
            const identity = req.files.identity
            const identityName = identity.name

            await photo.mv(`./uploads/photo/${photoName}`);
            await identity.mv(`./uploads/ktp/${identityName}`);

            const post = new couriersModels.updateOne({ _id: req.params._getId },
                {$set:{
                full_name: req.body.full_name,
                courier_info: {
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    identity_card: identityName,
                    photo: photoName
                },
                status: true
            }})
            const save = await post.save();
            res.json(save)
        } else {
            const photo = req.body.photo
            const identity = req.body.identity
            const post = await couriersModels.updateOne({ _id: req.params._getId },
                {
                full_name: req.body.full_name,
                courier_info: {
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    identity_card: identity,
                    photo: photo
                },
                status: true
                })
            const save = await post.save();
            res.json({
                success: 'Berhasil Update Data Courier',
                data: save
            })
        }



    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});

router.delete('/:_getId', async (req, res) => {
    try {
        const data = await couriersModels.updateOne({ _id: req.params._getId }, {
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