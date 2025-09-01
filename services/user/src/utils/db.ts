import mongoose from "mongoose";

const connectDb = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI as string, {
			dbName: "blog-microservices",
		});

		console.log("Connected to mongodb");
	} catch (error) {
		console.log("error in utils->db: ", error);
	}
};

export default connectDb;
