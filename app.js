const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser=require('body-parser')
const routing=require('./routes/routes');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();




// app.use(fileUpload());

app.use(cors());
app.options('*', cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads/testing', express.static('./uploads/testing'))
app.use('/user/view/profile', express.static('./uploads/mobile/profile'))
app.use('/user/view/product', express.static('./uploads/imageProduct'))
app.use('/view/document', express.static('./uploads/ktpandprofile'))
app.use('/view/document/ktp', express.static('./uploads/admin/ktp'))
app.use('/view/voucher', express.static('./uploads/voucher'))

// midleware
// app.use('/*', (req, res, next) => {
//     console.log(req.originalUrl)
//     if (req.originalUrl === '/uploads/*') {
//         return next();
//     } else {
         
//         var token = req.headers['secret'];
//         if (token != process.env.CONNECTION_SECRET) {
//             console.log(req.originalUrl)
//             res.status(401);
//             res.end();
               
//         }
//         else {
//             next();
//         }
//     }

// });
app.use('/', routing);


//connect database
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('connect to db'));

let db = mongoose.connection





db.on('error', console.error.bind(console, 'Database connect Error!'))
db.once('open', function () {
    console.log('Database Is Connected')
})

const PORT = process.env.PORT || 3002;
console.log(PORT)
app.listen(PORT, function () {
    console.log(`Server Is Running is ${PORT}`)
});
