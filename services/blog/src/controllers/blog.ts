import axios from "axios";
import { redisClient } from "../utils/redis.js";
import { sql } from "../utils/db.js";

const cacheEnabled = false;

export const getAllBlogs = async (req: any, res: any) => {
	try {
		// The logical OR operator `||` returns the value on the right-hand side
		// if the left value is falsy.
		// `undefined`, `null`, 0, "" (empty string), and `false` are all falsy values.
		// let searchKeyword = req.query.searchKeyword || "";
		// let category = req.query.category || "";

		let searchKeyword = req.query.searchQuery ?? "";
		// let category = req.query.category ?? "";
		let category =
			req.query.category === "All" || req.query.category === ""
				? ""
				: req.query.category;
		// The nullish coalescing operator `??` returns the value on the right-hand side
		// only if the left value is `null` or `undefined`.
		// It does not treat other falsy values as defaults.

		// 	DON'T WANT TO CROSS UPSTASH ALLOCATION CAP.
		if (cacheEnabled) {
			const cachedData = await redisClient.get(
				`blogs:${searchKeyword}:${category}`
			);

			// if found in cache, return it
			if (cachedData) {
				console.log("Blogs served from Redis cache");
				const parsedData = JSON.parse(cachedData);
				res.json(parsedData);
				return;
			}
		}

		// not found in cache
		// fetch from db
		let blogs;
		if (searchKeyword && category) {
			blogs = await sql`select * from blogs where ( title ilike ${
				"%" + searchKeyword + "%"
			} or description ilike ${
				"%" + searchKeyword + "%"
			} ) and category = ${category} order by create_at desc`;
		} else if (searchKeyword) {
			blogs = await sql`select * from blogs where ( title ilike ${
				"%" + searchKeyword + "%"
			} or description ilike ${
				"%" + searchKeyword + "%"
			}) order by create_at desc`;
		} else if (category) {
			blogs =
				await sql`select * from blogs where category=${category} order by create_at desc`;
		} else {
			blogs = await sql`select * from blogs order by create_at desc`;
		}

		console.log("Blogs served from db");
		// store to cache
		await redisClient.set(
			`blogs:${searchKeyword}:${category}`,
			JSON.stringify(blogs),
			{ EX: 3600 }
		);

		res.json(blogs);
	} catch (error: any) {
		console.log("❌try-catch error at getAllBlogs: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSingleBlog = async (req: any, res: any) => {
	try {
		console.log("inside getSingleBlog");

		const blogId = req.params.id;

		// REDIS DISABLED
		// const cachedData = await redisClient.get(`blog:${blogid}`);
		// if (cachedData) {
		// 	console.log("Blog Served from Redis cache");
		// 	const parsedData = JSON.parse(cachedData);
		// 	res.json(parsedData);
		// 	return;
		// }

		// not found in cache

		const blog = await sql`SELECT * FROM blogs WHERE id = ${blogId}`;
		// fetch from db
		if (blog.length === 0) {
			res.status(404).json({
				message: "no blog with this id",
			});
			return;
		}

		// now fetch `authorsData` then append to blogData
		const blogAuthorId = blog[0].author;
		const { data } = await axios.get(
			`${process.env.USER_SERVICE_URL}/api/v1/user/${blogAuthorId}`
		);

		const responseData = { blog: blog[0], author: data };

		// REDIS DISABLED
		// repopulate cache
		// await redisClient.set(`blog:${blogid}`, JSON.stringify(responseData), {
		// 	EX: 3600,
		// });

		console.log("Blog Served from db");
		res.json(responseData);
	} catch (error: any) {
		console.log("error at getSingleBlog: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSingleBlogForAuthUser = async (req: any, res: any) => {
	// req.user:  {
	// [1]   _id: '68d033c2c8d3c05f48030914',
	// [1]   name: 'Shahir Adil Sizan',
	// [1]   email: 'shahir.sizan18@gmail.com',
	// [1]   image: 'https://res.cloudinary.com/deh1ctb1t/image/upload/v1758650283/blogs/eo5a8ljllmmqpm5knzfp.png',
	// [1]   createdAt: '2025-09-21T17:20:02.810Z',
	// [1]   updatedAt: '2025-09-23T17:58:33.166Z',
	// [1]   __v: 0,
	// [1]   bio: 'Software Engineer'
	// [1] }
	try {
		console.log("inside getSingleBlogForAuthUser");

		const blogId = req.params.id;
		const userId = req.user._id;

		// REDIS DISABLED
		// const cachedData = await redisClient.get(`blog:${blogid}`);
		// if (cachedData) {
		// 	console.log("Blog Served from Redis cache");
		// 	const parsedData = JSON.parse(cachedData);
		// 	res.json(parsedData);
		// 	return;
		// }

		// not found in cache

		const blog = await sql`SELECT * FROM blogs WHERE id = ${blogId}`;
		// fetch from db
		if (blog.length === 0) {
			res.status(404).json({
				message: "no blog with this id",
			});
			return;
		}

		// now fetch whether blog saved by user or not
		let isSaved = false;
		const isBlogSaved =
			await sql`SELECT * FROM savedblogs WHERE blogid = ${blogId} AND userid = ${userId}`;
		console.log("isBlogSaved: ", isBlogSaved);

		if (isBlogSaved.length > 0) {
			isSaved = true;
		}

		// now fetch `authorsData` then append to blogData
		const blogAuthorId = blog[0].author;
		const { data } = await axios.get(
			`${process.env.USER_SERVICE_URL}/api/v1/user/${blogAuthorId}`
		);

		const responseData = { blog: blog[0], author: data, isSaved: isSaved };

		// REDIS DISABLED
		// repopulate cache
		// await redisClient.set(`blog:${blogid}`, JSON.stringify(responseData), {
		// 	EX: 3600,
		// });

		console.log("Blog Served from db");
		res.json(responseData);
	} catch (error: any) {
		console.log("error at getSingleBlog: ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllComments = async (req: any, res: any) => {
	const { id } = req.params;

	const comments =
		await sql`SELECT * FROM comments WHERE blogid = ${id} ORDER BY create_at DESC`;

	console.log("comments: ", comments);

	res.json(comments);
};

export const addComment = async (req: any, res: any) => {
	try {
		const { id: blogid } = req.params;
		const { comment } = req.body;
		const user = req.user;

		await sql`INSERT INTO comments (comment, blogid, userid, username) VALUES (${comment}, ${blogid}, ${user?._id}, ${user?.name}) RETURNING *`;

		res.json({
			message: "Comment Added",
		});
	} catch (error: any) {
		console.log("error -> addComment(): ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const deleteComment = async (req: any, res: any) => {
	try {
		const { commentid } = req.params;

		const comment =
			await sql`SELECT * FROM comments WHERE id = ${commentid}`;

		// console.log(comment);

		if (comment[0].userid !== req.user?._id) {
			res.status(401).json({
				message: "You are not owner of this comment",
			});
			return;
		}

		await sql`DELETE FROM comments WHERE id = ${commentid}`;

		res.json({
			message: "Comment Deleted",
		});
	} catch (error: any) {
		console.log("error -> deleteComment(): ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const saveBlog = async (req: any, res: any) => {
	try {
		const { blogid } = req.params;
		const userid = req.user?._id;

		if (!blogid || !userid) {
			res.status(400).json({
				message: "Missing blog id or userid",
			});
			return;
		}

		const alreadySaved =
			await sql`SELECT * FROM savedblogs WHERE blogid = ${blogid} AND userid = ${userid}`;

		// if already saved, then unsave
		if (alreadySaved.length !== 0) {
			await sql`DELETE FROM savedblogs WHERE blogid = ${blogid} AND userid = ${userid}`;
			res.status(200).json({
				message: "Blog Unsaved",
			});
			return;
		}
		// if not saved, then save
		if (alreadySaved.length === 0) {
			await sql`INSERT INTO savedblogs (blogid, userid) VALUES (${blogid}, ${userid})`;
			res.status(200).json({
				message: "Blog Saved",
			});
			return;
		}
	} catch (error: any) {
		console.log("❌ error -> saveBlog(): ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSavedBlogs = async (req: any, res: any) => {
	try {
		const savedEntries =
			await sql`SELECT * FROM savedblogs WHERE userid=${req.user?._id}`;

		// console.log("savedEntries: ", savedEntries);
		// savedEntries:  []

		// If no saved blogs, return empty array
		if (savedEntries.length === 0) {
			res.status(200).json({
				message: "No saved blogs",
				blogs: [],
			});
			return;
		}

		const savedBlogsIds = savedEntries.map((item) => {
			return item.blogid;
		});

		const savedBlogsFinal =
			await sql`SELECT * FROM blogs WHERE id = ANY(${savedBlogsIds})`;
		// When used with `= ANY`, it is logically equivalent to `IN`. Search google if confused

		// console.log("savedBlogsFinal: ", savedBlogsFinal);

		res.status(200).json({
			message: "saved blogs fetched successfully",
			blogs: savedBlogsFinal,
		});
	} catch (error: any) {
		console.log("❌ error -> getSavedBlog(): ", error);
		res.status(500).json({
			message: error.message,
		});
	}
};
