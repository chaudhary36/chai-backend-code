import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 

const DBconnection  = async function(){
    try {
    const connectionInfo = await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`)
    console.log(`Connected successfully: ${connectionInfo.connection.port}`);
    } catch (error) {
        console.log("ERROR while connecting DB Server: " , error);
        process.exit(1)
    }
}

export default DBconnection
