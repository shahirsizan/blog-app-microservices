import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./utils/db.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDb();
const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
