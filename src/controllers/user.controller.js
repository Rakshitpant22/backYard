import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
//! Steps to follow to register User
    // 1. get user details from the frontend   
    // 2. validations = all details are filled
    // 3. check if user already exists by username /email
    // 4. check for images ,check for avatar   
    // 5. upload them to cloudinary 
    // 6. create user object - create entry in db
    // 7. remove password & refresh token field from response
    // 8. check for user creation -> if created return res ELSE return error 
   
    const{fullName,email,username,password}=req.body
    console.log("email:",email);

    //!  now validations can also check by if but better practise is to use some method
    // this below function if any field is empty or contains only spaces
    if(
        [fullName,email,username,password].some((field)=> 
        field?.trim()=== "")
    ){
        throw new ApiError(400,"All field are necessery"); 
    }
   
    //! now check if user is already registered or not
   const existedUser = User.findOne({
    $or:[{username},{email}]
   })
   if(existedUser){
    throw new ApiError(409,"User with email or Password already exists"); 
   }

   //! check for images
   //used to safely access the path of an uploaded file (in this case, an avatar image) in a Node.js application, typically when using file upload middleware like multer
   const avatarLocalPath=req.files?.avatar[0]?.path ;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;

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
    coverImage:coverImage?.url ||"" ,   //as we hve check for avatar but not for cover image so check here only
    email,
    password,
    username:username.toLowerCase()
  })
  //! remove password and other fields from response
  const createdUser = await User.findById(User._id).select
  ("-password -refreshToken") // check if now user is registered on db  and remove certain fields to get stored

  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user"); 
  }

  //! return the response

 return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Succesfully")
 )

});

export { registerUser };

