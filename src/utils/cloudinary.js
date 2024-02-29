import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";
          
          
cloudinary.config({ 
  cloud_name: 'dtxn1cbx6', 
  api_key: '291956989252498', 
  api_secret: 'TGe-6j2V8qX5IcRRS6MCc2cJmNI' 
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


