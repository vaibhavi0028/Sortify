import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://pavangcoding:8rBQQa1qwXkom8aL@cluster0.qzx3n.mongodb.net/Sortify');
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};
