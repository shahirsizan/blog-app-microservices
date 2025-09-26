import express from "express";
import "dotenv/config";
import blogRoutes from "./routes/blog.js";
import cors from "cors";
import { redisClient } from "./utils/redis.js";
import { startMessageConsumer } from "./utils/consumer.js";

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

try {
	await redisClient.connect();
	console.log("✅ Redis Upstash connected!");
} catch (error) {
	console.log("❌ Redis Upstash error: ");
}

// We have some `GET` requests in this microservice.
// We need a messageConsumer to know about any data change
// the following will run asynchronously in background
startMessageConsumer();

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
