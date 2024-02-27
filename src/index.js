import DBconnection from "./db/index.js";
import dontenv from "dotenv";
import { app } from "./app.js";
dontenv.config({
    path: "./.env"
})


DBconnection()
.then(()=>{
    const tryPort = process.env.PORT || 8000
    app.listen(tryPort, ()=>{
        console.log(`Server is running at port: ${tryPort}`);
    })
})
.catch((err)=>{
    console.log(`Connection through the DB is failed!! : `, err);
})