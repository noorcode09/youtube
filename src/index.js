// require("dotenv").config({path: './env'})
import dotenv from 'dotenv';
import app from './app';
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`);
    });
    app.on( (error) => {
        console.log("ERROR : ", error)
        throw error;
    })
})
.catch( (err) => {
    console.log(`MONGO db connection failed !!!`, err)
})














// import express from "express";
// const app = express();

// ;( async() => {
//     try {
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on( "error", (error) => {
//             console.log("ERROR:", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("Eroor:",error)
//     }
// })()