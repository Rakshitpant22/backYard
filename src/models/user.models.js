import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

},{timestamps:true})

//! direct encryption is not possible so we use pre hook-> (mongoose hook)--> a  middleware
//! pre hook can execute task just before saving data  ex (password encryption)

userSchema.pre("save", async function(next) { //pre uses nomral function bcs arrow function does hold context reference
    if( ! this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10)
    next()                                          // async is used bcs encryption is time taking process and uses next as pre is a middleware
}) 

userSchema.methods.isPasswordCorrect = async function(password){
 await bcrypt.compare(password,this.password) 
}
// jab user ko import karae usse pehle puchle password is wrong or correct
// for this mongoose gives us methods to make custom methods; if not there it will created ex isPasswordCorrect

// ! Access token genrated by JWT
userSchema.methods.generateAccessTokens= function(){
return jwt.sign({
    id:this.id,
    email:this.email,
    username:this.username,
    fullName:this.fullName
 },process.env.ACCESS_TOKEN_SECRET,
  {
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)}
// ! Refresh token genrated by JWT
userSchema.methods.generateRefreshTokens= function(){
    return jwt.sign({
       id:this.id,
     },process.env.REFRESH_TOKEN_SECRET,
       {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
)}

export const User = mongoose.model("User",userSchema)