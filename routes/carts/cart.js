const express = require('express');
const router = express.Router();
const cartsModel = require('../../models/cartsModels')
var crypto = require('crypto')

router.get('/', async (req, res) => {
    try {
        var data = await cartsModel.find({ 'status': true })
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.files) {
            const photo = req.files.photo
            const photoName = photo.name
            const identity = req.files.identity
            const identityName = identity.name

            await photo.mv(`./uploads/photo/${photoName}`);
            await identity.mv(`./uploads/ktp/${identityName}`);

            const post = new cartsModel({
                full_name: req.body.full_name,
                password: crypto.createHash('md5').update(req.body.password).digest('hex'),
                carts_info: {
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    identity_card: identityName,
                    photo: photoName
                },
                cart_detail: {
                    cart_name: req.body.email,
                    address: req.body.address,
                    long: req.body.long,
                    lat:req.body.lat,
                },
                status: true
            })
            const save = await post.save();
            res.json(save)
        } else {
            res.send('There are no files')
        }



    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});
module.exports = router;