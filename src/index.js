import DBconnection from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
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

// importing userRouter
import UserRouter from "./routes/user.routes.js"


app.use("/api/v1/users" , UserRouter)