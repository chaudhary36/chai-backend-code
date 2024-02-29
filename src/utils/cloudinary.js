import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";
          
          
cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_CLOUD_KEY, 
  api_secret: CLOUDINARY_CLOUD_SECRET  // Need to change when want to use i mean fix it as soon!
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null           
        const response = await cloudinary.uploader.upload(localFilePath , {resource_type: "auto"})
        // for our mann ki santi ke liye ek console.log

        console.log("File has been uploaded successfully and url is");
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("File hasn't upload" , error);
        return null 
    }
}

export { uploadOnCloudinary }


