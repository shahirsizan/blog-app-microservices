import express from "express";
import "dotenv/config";
import blogRoutes from "./routes/blog.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
