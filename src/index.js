//require('dotenv').config({path:'./env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})

connectDB()
















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