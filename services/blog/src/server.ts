import express from "express";
import "dotenv/config";
import blogRoutes from "./routes/blog.js";
import cors from "cors";
import { createClient } from "redis";

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

export const redisClient = createClient({
	url: process.env.REDIS_URL,
});
await redisClient.connect();
redisClient.on("error", (err) => {
	console.log("blog -> server.ts: ", err);
});
console.log("Connected to redis.");

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
