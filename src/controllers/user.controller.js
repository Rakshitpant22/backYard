import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


//? this is separate function for generating access & refresh tokens if user 
const generateAccessAndRefreshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
//! STEPS TO REGISTER USER
    // 1. get user details from the frontend   
    // 2. validations = all details are filled
    // 3. check if user already exists by username /email
    // 4. check for images ,check for avatar   
    // 5. upload them to cloudinary 
    // 6. create user object - create entry in db
    // 7. remove password & refresh token field from response
    // 8. check for user creation -> if created return res ELSE return error 
   
    //! get user details from the frontend
    const{fullName,email,username,password}=req.body
    //console.log("email:",email);

    //!  Now validations can also check by if but better practise is to use some method
    // this below function if any field is empty or contains only spaces
    if(
        [fullName,email,username,password].some((field)=> 
        field?.trim()=== "")
    ){
        throw new ApiError(400,"All field are necessery"); 
    }
   
    //! now check if user is already registered or not
   const existedUser = await User.findOne({
    $or: [{ username }, { email }]
   });

   if(existedUser){
    throw new ApiError(409,"User with email or username already exists"); 
   }

   //! check for images
   //used to safely access the path of an uploaded file (in this case, an avatar image) in a Node.js application, typically when using file upload middleware like multer
   const avatarLocalPath = req.files?.avatar[0]?.path ;
   //const coverImageLocalPath=req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
   }

   if(!avatarLocalPath){
     throw new ApiError(409,"Avatar file is Required")
   }

   //! upload on Cloudinary 
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)


  if(!avatar){
    throw new ApiError(400,"Avatar file is required"); 
  }
 
  //! create user
  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",   //as we hve check for avatar but not for cover image so check here only
    email,
    password,
    username:username.toLowerCase()
  })

  //! remove password and other fields from response
  const createdUser = await User.findById(user._id).select
  ("-password -refreshToken") // check if now user is registered on db  and remove certain fields to get stored


  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user"); 
  }
  //! return the response
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Succesfully")
  )
});

const loginUser= asyncHandler(async(req,res)=>{
//! STEPS TO LOGIN USER
   // 1. req->body se data le ao
   // 2. username or email based login
   // 3. find the user
   // 4. if user find check password 
   // 5. if password correct then generate Access and refresh Token
   // 6. send cookie

 //! taking data from req body
     const{email,username,password} =req.body
     console.log(email);

     if(!username && !email){
      throw new ApiError(400,"Usename or email is required")
    }

//! finding the user
    const user = await User.findOne({      
     $or:[{username},{email}]  // $or:[{},{}] is a mongoDB query .This query checks if a user with the provided username or email already exists in the database

    // The return type is typically an instance of the User model (i.e., an object representing the user), or null if no match is found.
    })

    if(!user){
      throw new ApiError(400,"User does not Exist")
    }
 
//! Checking the password if user exists 
    const isPasswordValid = await user.isPasswordCorrect(password) // here using user not User bcs User is mongoose object //? so mongoose k through methods available hai ex(findOne) there User is used // jo hum functions bnaenge vo user s bnaenge(user - jis user ka instance db se lia ha)

    if(!isPasswordValid){
      throw new ApiError(401,"Invalid User Credentials")
    }

//! if password correct then generate Access and refresh Token
 const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

 const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // token generate kr die pr Db m store bhi tokrane hai uske lie y kra  

//! send the cookies
const options={
  httpOnly:true,
  secure:true
}
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json( new ApiResponse(
  200,
  {
    user:loggedInUser,accessToken,refreshToken,
  },
  "User logged in succesfully"
))
})

const logoutUser = asyncHandler(async (req,res)=>{
 await User.findByIdAndUpdate(
  req.user._id,
    {
    $set:{
      refreshToken : undefined
    }
    },
    {
      new : true
    }
 )

 const options={
  httpOnly:true,
  secure:true
} 
   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged Out"))
})


// Access Token - Short lived, not stored in db
// Refresh Token - Long lived, stored in db
// When access token expires, the frontend sends the refresh token to the backend to validate user (login), once again.
//! this is refresh acces token updation logic written 
const refreshAccessToken= asyncHandler(async(req,res)=>{
  const incomingRefreshAccessToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshAccessToken){
    throw new ApiError(401,"unauthorized request")
  }

  // if got then verify refresh token 
  try {
    const decodedToken = jwt.verify(incomingRefreshAccessToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)// us refresh token k corresponding user find kra DB me
    if(!user){ //if user not found then invalid refresh token
      throw new ApiError(401,"Invalid refresh Token")
    }
    
    if(incomingRefreshAccessToken !== user.refreshToken){
      throw new ApiError(401," refresh Token is expired or used")
    }
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken : newRefreshToken},
        "Access Token Refreshed "
      )
    )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh Token")
  }
})

export { registerUser ,loginUser ,logoutUser,refreshAccessToken};

