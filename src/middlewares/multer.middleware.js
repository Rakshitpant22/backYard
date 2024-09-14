// Multer allows you to configure how files should be stored when uploaded. Here  using diskStorage() to store the uploaded files on the disk (file system).

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {  // destination: This function specifies the directory where the uploaded files should be saved. Here, it’s set to "./public/temp". It uses a callback cb to indicate success or failure in setting the destination.
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) { // filename: This function specifies the name of the file that will be saved on the disk. Here, it’s using the original filename (file.originalname).
      cb(null, file.originalname) // this gives the file localpath
    }
  })
  
export const upload = multer({ 
    storage, 
})