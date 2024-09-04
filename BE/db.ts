// db.ts
import mongoose from "mongoose";

const mongoURI = "mongodb+srv://mihaitaneamt:5pGvaX6ItrXDNFxp@cluster0.woljg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI,
        //      {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }
    );
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
