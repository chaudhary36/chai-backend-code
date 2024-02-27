import DBconnection from "./db/index.js";
import dontenv from "dotenv";
dontenv.config({
    path: "./.env"
})


DBconnection()