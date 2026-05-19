import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "Foody",
        })
        console.log("connected to MongoDb")
    } catch(error) {
        console.log(error)
    }

};

export default connectDB;