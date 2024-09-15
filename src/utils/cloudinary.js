// we have file in our locals erver currently this utility upload this local file to cloudinary
// so when fles gets uploaded on cloudinary we remove that from our local server ( this is done by unlink method of node js file system )

import { v2 as cloudinary} from "cloudinary";
import fs from 'fs' // node js has file system helps in read write etc.. tasks

   cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async (loacalFilePath)=>{
    try {
        if(!loacalFilePath)return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(loacalFilePath,{
            resource_type:"auto"
        })
       console.log("file has been uploaded succesfully",response.url) //file has been uploaded succesfully
       return response;

    } catch (error) {
        fs.unlinkSync(loacalFilePath);// as upload failed unlink function removes locally saved temporary files
        return null;
    }
}

export {uploadOnCloudinary}