import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app= express()

 //! MIDDLEWARES 
// app.use(cors()) //all the middlewares are called using use() this is used in a Node.js/Express application to enable CORS (Cross-Origin Resource Sharing).// can also be futher configured 
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
})) 
app.use(express.json({ // json ko accepts krane k lie  pehle express json files ko accept krane k lie body-parser use krna pdta tha
    limit:"16kb"
}))
app.use(express.urlencoded({
   extended:true,
   limit:"16kb"
})) //  is a middleware function in Express.js used to parse incoming URL-encoded request bodies, such as those sent by HTML forms. It makes the data available in req.body for easier handling.•	{ extended: true allows for parsing complex objects and arrays.}•	{extended: false supports only simple key-value pairs}.
app.use(express.static("public"))
app.use(cookieParser()) // is a middleware for Express.js that is used to parse cookies attached to the client request object. It allows you to access and manipulate cookies sent by the client.


//! ROUTES
import userRouter from './routes/user.route.js'

//routes declaration
app.use("/api/v1/users",userRouter) // means when we hit page/users then userRouter gets activated

export {app}
