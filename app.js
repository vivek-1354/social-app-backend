const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer')
const {v4: uuidv4} = require('uuid')

const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const app = express();

const fileStorege = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'images')
    },
    filename : (req, file, cb) => {
        // cb(null, file.originalname)
        cb(null, uuidv4())
    }
})

const fileFilter = (req,file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

// app.use(bodyParser.urlencoded())  // x-www-form-urlencoded
app.use(bodyParser.json())   // application/json

app.use(multer({storage :fileStorege, fileFilter:fileFilter}).single('image'))

// serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)


app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data
    res.status(status).json({message:message, data: data})
})

mongoose.connect( 
    "mongodb+srv://testUser:et9vEiaZldFyRHPV@cluster0.aofa9mr.mongodb.net/messages"
).then(result =>{
    app.listen(8080, ()=> {
        console.log('Connected...')
    })
}).catch(err => {
    console.log(err)
})

