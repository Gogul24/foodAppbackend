const express = require('express')
const cors = require('cors')
const  mongoose = require('mongoose')
const dotenv = require('dotenv')
const route = require('./routes/routes')

const app = express();
app.use(cors())
app.use(express.json())
dotenv.config()

const url = process.env.MONGOURL
const port = process.env.port || 8080

mongoose.connect(url)
.then(()=>{
    console.log("DB connected successfully");
    app.listen(port,()=>{
        console.log(`Server is running at port ${port}`);
    })
})
.catch(err=>console.log(err))

app.use('/api',route)

