const express = require('express');
const router = express.Router();
const cartsModel = require('../../models/cartsModels')
var crypto = require('crypto')
const multer = require('multer')

let storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/ktpandprofile')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

let uploadKtp = multer({ storage: storageFile })


router.post('/', uploadKtp.fields([{ name: 'ktp', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), async function (req, res) {
    const { full_name, password, email, phone_number, cart_name, address, long, lat } = req.body


    try {

        if (req.files) {
            let post = new cartsModel({
                full_name: full_name,
                password: crypto.createHash('md5').update(password).digest('hex'),
                email: email,
                carts_info: {
                    phone_number: phone_number,
                    identity_card: `https://warehouse-fobeca.herokuapp.com/view/document/${req.files.ktp[0].filename}`,
                    photo: `https://warehouse-fobeca.herokuapp.com/view/document/${req.files.photo[0].filename}`
                },

                cart_detail: {
                    cart_name: cart_name,
                    address: address,
                    long: long,
                    lat: lat,
                },
                status: true
            })

            await post.save()

            res.json({
                message: 'success',
                data: 'berhasil add merchant'
            })

        }
        else {
            res.json({
                message: 'error',
                data: 'no file upload'
            })
        }

    } catch (err) {
        res.json({
            message: 'error',
            data: err
        })
    }

})

router.get('/', async (req, res) => {
    try {
        var data = await cartsModel.find({ 'status': true })
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});

// router.post('/', async (req, res) => {
//     try {
//         if (req.files) {
//             const photo = req.files.photo
//             const photoName = photo.name
//             const identity = req.files.identity
//             const identityName = identity.name

//             await photo.mv(`./uploads/photo/${photoName}`);
//             await identity.mv(`./uploads/ktp/${identityName}`);

//             const post = new cartsModel({
//                 full_name: req.body.full_name,
//                 password: crypto.createHash('md5').update(req.body.password).digest('hex'),
//                 email: req.body.email,
//                 carts_info: {
//                     phone_number: req.body.phone_number,
//                     identity_card: identityName,
//                     photo: photoName
//                 },
//                 cart_detail: {
//                     cart_name: req.body.cart_name,
//                     address: req.body.address,
//                     long: req.body.long,
//                     lat:req.body.lat,
//                 },
//                 status: true
//             })
//             const save = await post.save();
//             res.json(save)
//         } else {
//             res.send('There are no files')
//         }



//     } catch (error) {
//         res.status(500)
//         res.json({ message: error })
//     }
// });
module.exports = router;