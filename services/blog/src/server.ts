import express from "express";
import "dotenv/config";
import blogRoutes from "./routes/blog.js";
import cors from "cors";
import { runRedis } from "./utils/redis.js";
import { startMessageConsumer } from "./utils/consumer.js";

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

export const redisClient = await runRedis();

// messageConsumer will run asynchronously in background
startMessageConsumer();

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
