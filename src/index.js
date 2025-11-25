const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes/index');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(bodyParser.json())
app.use(cookieParser())

app.get("/test", (req, res) => {
    res.send("TEST OK");
});


routes(app)


mongoose.connect(`${process.env.MONGO_DB}`)
    .then(()=>{
        console.log('ket noi thanh cong')
    })
    .catch((err)=>{
        console.log(err)
    })

app.listen(port, ()=>{
    console.log('Server đang chạy tại:', + port)
})