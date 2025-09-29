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
		const { authorId, title, description, blogcontent, category } =
			req.body;
		const file = req.file;

		// req.user object is:
		// [1]   user: {
		// [1]     _id: '68d033c2c8d3c05f48030914',
		// [1]     name: 'Shahir Adil Sizan',
		// [1]     email: 'shahir.sizan18@gmail.com',
		// [1]     image: 'https://res.cloudinary.com/deh1ctb1t/image/upload/v1758650283/blogs/eo5a8ljllmmqpm5knzfp.png',
		// [1]     createdAt: '2025-09-21T17:20:02.810Z',
		// [1]     updatedAt: '2025-09-23T17:58:33.166Z',
		// [1]     __v: 0,
		// [1]     bio: 'Software Engineer'
		// [1]   },
		// [1]   iat: 1759084397,
		// [1]   exp: 1759516397
		// [1] }

		// NICHER PROCEDURE TA AMI NIJE NIJE KORSI. BUT ORIGINAL TUTOR ONNOVABE KORSE
		// NICHE DEKHO. DUITAI OK
		// if (authorId !== req.user._id) {
		// 	res.status(403).json({
		// 		message: "You don’t have permission to edit the post.",
		// 	});
		// 	return;
		// }

		const toBeUpdatedBlog = await sql`SELECT * FROM blogs WHERE id = ${id}`;
		if (!toBeUpdatedBlog.length) {
			res.status(404).json({
				message: "No blog with this id",
			});
			return;
		}

		if (toBeUpdatedBlog[0].author !== req.user?._id) {
			res.status(403).json({
				message: "You are not the author of the blog",
			});
			return;
		}

		// CLOUDINARY
		let oldImageUrl = toBeUpdatedBlog[0].image;
		let newImageUrl = "";
		if (file) {
			const dataURIobj = getDataURIobj(file);
			const cloudinaryObj = await cloudinary.v2.uploader.upload(
				dataURIobj.content as string,
				{
					folder: "blogs",
				}
			);

			newImageUrl = cloudinaryObj.secure_url;
		}

		const updatedBlog = await sql`UPDATE blogs SET
			title = ${req.body.title || toBeUpdatedBlog[0].title},
			description = ${req.body.description || toBeUpdatedBlog[0].description},
			image= ${newImageUrl || oldImageUrl},
			blogcontent = ${req.body.blogcontent || toBeUpdatedBlog[0].blogcontent},
			category = ${req.body.category || toBeUpdatedBlog[0].category}

			WHERE id = ${req.params.id}
			RETURNING *
			`;

		// RABBITMQ DISABLED
		// await sendMsgToRabbitmq("cache-invalidation", [
		// 	"blogs:*",
		// 	`blog:${id}`,
		// ]);

		console.log("updatedBlog: ", updatedBlog);

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

export const deleteBlog = async (req: any, res: any) => {
	try {
		const Id = req.params.id;
		const blog = await sql`SELECT * FROM blogs WHERE id = ${Id}`;

		if (blog[0].author !== req.user?._id) {
			res.status(401).json({
				message: "You are not author of this blog",
			});
			return;
		}

		if (!blog.length) {
			res.status(404).json({
				message: "No blog with this id",
			});
			return;
		}

		await sql`DELETE FROM savedblogs WHERE blogid = ${Id}`;
		await sql`DELETE FROM comments WHERE blogid = ${Id}`;
		await sql`DELETE FROM blogs WHERE id = ${Id}`;

		// RABBITMQ DISABLED
		// await sendMsgToRabbitmq("cache-invalidation", [
		// 	"blogs:*",
		// 	`blog:${Id}`,
		// ]);

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
