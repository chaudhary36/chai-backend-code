import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})    
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET  // fixed!
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null           
        const response = await cloudinary.uploader.upload(localFilePath , {resource_type: "auto"})
        // for our mann ki santi ke liye ek console.log

        // console.log("File has been uploaded successfully and url is");

        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("File hasn't upload" , error);
        return null 
    }
}

export { uploadOnCloudinary }


