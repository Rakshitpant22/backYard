//require('dotenv').config({path:'./env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path:'./env'
})

// connectDB() // only this can also connects db 

// .then is used bcs we have implemnted DB connection using asynchronous method 
// and whenever asynchronous method is completed then it returns a Promise
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(` Server is running at port: ${process.env.PORT}`)
    })
})
.catch(error=>{
    console.log("MongoDB connection failed!!" ,err)
})
















// method 1 --> MAKE DB CONNECTION CODE IN INDEX.JS
// (async()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}`/ ${DB_NAME})
//        app.on("error",()=>{
//         console.log("ERRR:");
//         throw error
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(`APP listnening on port ${process.env.PORT}`)
//        })
//     }catch(error){
//         console.error("ERROR:")
//     }
// })();