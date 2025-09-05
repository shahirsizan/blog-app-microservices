import axios from "axios";
import { sql } from "../utils/db.js";

export const getAllBlogs = async (req: any, res: any) => {
	try {
		// console.log("req.query: ", req.query);
		const searchQuery = req.query.searchQuery;
		const category = req.query.category;

		// const { searchQuery = "", category = "" } = req.query;
		let blogs;

		if (searchQuery && category) {
			blogs = await sql`select * from blogs where ( title ilike ${
				"%" + searchQuery + "%"
			} or description ilike ${
				"%" + searchQuery + "%"
			} ) and category = ${category} order by create_at desc`;
		} else if (searchQuery) {
			blogs = await sql`select * from blogs where ( title ilike ${
				"%" + searchQuery + "%"
			} or description ilike ${
				"%" + searchQuery + "%"
			}) order by create_at desc`;
		} else if (category) {
			blogs =
				await sql`select * from blogs where category=${category} order by create_at desc`;
		} else {
			blogs = await sql`select * from blogs order by create_at desc`;
		}

		res.json(blogs);
	} catch (error: any) {
		console.log("error at getAllBlogs: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSingleBlog = async (req: any, res: any) => {
	try {
		const blogid = req.params.id;

		// fetch blog
		const blog = await sql`SELECT * FROM blogs WHERE id = ${blogid}`;

		if (blog.length === 0) {
			res.status(404).json({
				message: "no blog with this id",
			});
			return;
		}

		const blogAuthorId = blog[0].author;

		// also fetch `authorsData` then append to blogData
		const { data } = await axios.get(
			`${process.env.USER_SERVICE_URL}/api/v1/user/${blogAuthorId}`
		);

		const responseData = { blog: blog[0], author: data };

		res.json(responseData);
	} catch (error: any) {
		console.log("error at getSingleBlog: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addComment = async (req: any, res: any) => {
	try {
	} catch (error: any) {
		console.log("error at addComment: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllComments = async (req: any, res: any) => {
	try {
	} catch (error: any) {
		console.log("error at getAllComments: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const deleteComment = async (req: any, res: any) => {
	try {
	} catch (error: any) {
		console.log("error at deleteComment: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const saveBlog = async (req: any, res: any) => {
	try {
	} catch (error: any) {
		console.log("error at saveBlog: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSavedBlog = async (req: any, res: any) => {
	try {
	} catch (error: any) {
		console.log("error at : ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};
