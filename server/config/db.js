import mongoose from "mongoose";

const connectDb= async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("Database connected"))
        await mongoose.connect(`${process.env.MONGO_URI}/groceries`)
    }catch(e){
        console.error(e.message);

    }
}

export default connectDb;