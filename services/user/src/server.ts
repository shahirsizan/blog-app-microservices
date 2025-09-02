import express from "express";
import cors from "cors";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/user.js";

// Cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cors());
connectDb();
const port = process.env.PORT;

app.use("/api/v1", userRoutes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
