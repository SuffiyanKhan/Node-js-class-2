import express from 'express';
import router from './routes/index.js';
import mongoose from './db/index.js';

const app = express()

const PORT = process.env.PORT || 3000;


let db = mongoose.connection;
db.on("error" , console.error.bind("connection error"))
db.once("open" , () => {
    console.log("db connected!")
})

app.use(express.json())
app.use('/' , router)
app.listen(PORT , () => {
    console.log("server is runing...")
})

