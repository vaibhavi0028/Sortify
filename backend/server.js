import cors from 'cors';
import express from "express";
import { connectDB } from "./config/db.js";
import serviceRouter from "./routes/serviceRoute.js";

const app = express();
const port = 5000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());

connectDB();

// API endpoints
app.use("/api", serviceRouter);

app.get('/', (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});