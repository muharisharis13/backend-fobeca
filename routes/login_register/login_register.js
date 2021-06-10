const express = require('express');
const router = express.Router();
var crypto = require('crypto');
const loginRegisterModels = require('../../models/login_register')


router.get('/', async (req, res) => {
    try {
        var data = await loginRegisterModels.find();
        res.json(data)
    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});


router.post('/', async (req, res) => {
    const post = new loginRegisterModels({
        full_name: req.body.full_name,
        email: req.body.email,
        password:  crypto.createHash('md5').update(req.body.password).digest('hex'),
        roles: req.body.roles,
        status: true
    })
    try {
        const save = await post.save();
        res.json(save)

    } catch (error) {
        res.status(500)
        // res.json({ message: error })

        if (error.keyValue) {
            res.json({ message: 'Email Sudah Terdaftar' })
        }
    }
});

router.post('/update', async (req, res) => {
    const update = new loginRegisterModels.updateOne({_id},{$set:{
        
            full_name: req.body.full_name,
            email: req.body.email,
            password:  crypto.createHash('md5').update(req.body.password).digest('hex'),
            roles: req.body.roles,
            status: true
        
    }})
    try {
        res.json(update)

    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});

router.post('/login', async (req, res) => {

    try {
        const save = await loginRegisterModels.findOne({
            email: req.body.email,
            password:  crypto.createHash('md5').update(req.body.password).digest('hex'),
        });
        res.json(save)



    } catch (error) {
        res.status(500)
        res.json({ message: error })


    }
});

router.get('/:_getid', async (req, res) => {

    try {
        var data = await loginRegisterModels.findOne({ _id: req.params._getid })
        res.json(data)

    } catch (error) {
        res.status(500)
        res.json({ message: error })
    }
});


module.exports = router;