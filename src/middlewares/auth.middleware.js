// its verifies  that if the user is in DB or not this utility can be used any module

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";



export const  verifyJWT = asyncHandler(async (req,res,next)=>{
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw ApiError(401,"Unauthorized request")
     }
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).
     select("-password -refreshToken")
 
     if(!user){
         //! next vedio m dicuss hoga in detail
         throw new ApiError(401,"Invalid Access Token") 
     }
     
     req.user = user;
     next()
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token") 
   }
})
