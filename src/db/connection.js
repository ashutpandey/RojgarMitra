import mongoose from 'mongoose';
import { config } from 'dotenv';
config()


mongoose.connect(process.env.mongo_url,{
    dbName: "Rojgar-Mitra"
})
.then(()=>{
    console.log("Successfully Connected")
}).catch((error)=>{
    console.log(error);
})