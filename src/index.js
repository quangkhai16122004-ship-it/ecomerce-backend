const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.get('/', (req,res)=>{
     res.send('Hello world, hehe')
})

mongoose.connect(`mongodb+srv://khai1:${process.env.MONGO_DB}@ecomerce.vpgx54o.mongodb.net/?appName=ecomerce`)
    .then(()=>{
        console.log('ket noi thanh cong')
    })
    .catch((err)=>{
        console.log(err)
    })

app.listen(port, ()=>{
    console.log('Server đang chạy tại:', + port)
})