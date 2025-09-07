import cloudinary from "cloudinary";
import getDataURIobj from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { sendMsgToRabbitmq } from "../utils/rabbitmq.js";

export const createBlog = async (req: any, res: any) => {
	try {
		const { title, description, blogcontent, category } = req.body;
		const file = req.file;

		if (!file) {
			res.status(400).json({
				message: "No file to upload",
			});
			return;
		}

		const dataURIobj = getDataURIobj(file);

		const cloudinaryObj = await cloudinary.v2.uploader.upload(
			dataURIobj.content as string,
			{
				folder: "blogs",
			}
		);

		// cloudinaryObj is: {
		//     public_id: string;
		//     version: number;
		//     signature: string;
		//     width: number;
		//     height: number;
		//     format: string;
		//     resource_type: "image" | "video" | "raw" | "auto";
		//     created_at: string;
		//     tags: Array<string>;
		//     pages: number;
		//     bytes: number;
		//     type: string;
		//     etag: string;
		//     placeholder: boolean;
		//     url: string;
		//     secure_url: string;
		//     access_mode: string;
		//     original_filename: string;
		//     moderation: Array<string>;
		//     access_control: Array<string>;
		//     context: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
		//     metadata: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
		//     colors?: [string, number][];

		//     [futureKey: string]: any;
		// }

		const result =
			await sql`INSERT INTO blogs (title, description, image, blogcontent,category, author) VALUES (${title}, ${description},${cloudinaryObj.secure_url},${blogcontent},${category},${req.user?._id}) RETURNING *`;

		await sendMsgToRabbitmq("cache-invalidation", ["blogs:*"]);

		res.json({
			message: "Blog Created",
			blog: result[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateBlog = async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const { title, description, blogcontent, category } = req.body;
		const file = req.file;

		const toBeUpdatedBlog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

		if (!toBeUpdatedBlog.length) {
			res.status(404).json({
				message: "No blog with this id",
			});
			return;
		}

		if (toBeUpdatedBlog[0].author !== req.user?._id) {
			res.status(401).json({
				message: "You are not the author of the blog",
			});
			return;
		}

		let imageUrl = toBeUpdatedBlog[0].image;
		if (file) {
			const dataURIobj = getDataURIobj(file);

			const cloudinaryObj = await cloudinary.v2.uploader.upload(
				dataURIobj.content as string,
				{
					folder: "blogs",
				}
			);

			imageUrl = cloudinaryObj.secure_url;
		}

		const updatedBlog = await sql`UPDATE blogs SET
			title = ${title || toBeUpdatedBlog[0].title},
			description = ${description || toBeUpdatedBlog[0].description},
			image= ${imageUrl},
			blogcontent = ${blogcontent || toBeUpdatedBlog[0].blogcontent},
			category = ${category || toBeUpdatedBlog[0].category}

			WHERE id = ${id}
			RETURNING *
			`;

		await sendMsgToRabbitmq("cache-invalidation", [
			"blogs:*",
			`blog:${id}`,
		]);

		res.json({
			message: "Blog Updated",
			blog: updatedBlog[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// todo
export const deleteBlog = async (req: any, res: any) => {
	try {
		const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

		if (!blog.length) {
			res.status(404).json({
				message: "No blog with this id",
			});
			return;
		}

		if (blog[0].author !== req.user?._id) {
			res.status(401).json({
				message: "You are not author of this blog",
			});
			return;
		}

		await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
		await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
		await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;

		await sendMsgToRabbitmq("cache-invalidation", [
			"blogs:*",
			`blog:${req.params.id}`,
		]);

		res.json({
			message: "Blog Deleted",
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// todo
// export const aiTitleResponse = async (req: any, res: any) => {
// 	try {
// 	} catch (error: any) {}
// };

// todo
// export const aiDescriptionResponse = async (req: any, res: any) => {
// 	try {
// 	} catch (error: any) {}
// };

// todo
// export const aiBlogResponse = async (req: any, res: any) => {
// 	try {
// 	} catch (error: any) {}
// };
