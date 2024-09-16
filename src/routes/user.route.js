import { Router } from "express";
import { loginUser, logoutUser, registerUser }from "../controllers/user.controller.js"
import { upload  } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post( 
    upload.fields([
        {
            name:"avatar",
            maxCount:1
       },
       {
        name:"coverImage",
        maxCount:1
   }
]),
  registerUser) // registerUser s pehle middleware upload is used

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT ,logoutUser); // mtlb logout s pehle verifyJWt middldeware use kro

export default router;
