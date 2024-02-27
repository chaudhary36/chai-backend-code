import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET 
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null           
        const response = await cloudinary.uploader.upload(localFilePath , {resource_type: "auto"})
        // for our mann ki santi ke liye ek console.log

        console.log("File has been uploaded successfully and url is " , response.url);
        return response.url
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("File hasn't upload");
        return null 
    }
}

export { uploadOnCloudinary }


