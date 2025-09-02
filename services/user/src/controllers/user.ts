import User from "../model/User.js";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { v2 as cloudinary } from "cloudinary";

import { Request, Response } from "express";
import getBuffer from "../utils/dataUri.js";

export const loginUser = async (req: Request, res: any) => {
	try {
		const { email, name, picture } = req.body;

		let user = await User.findOne({ email: email });

		if (!user) {
			user = await User.create({
				name,
				email,
				image: picture,
			});
		}

		const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
			expiresIn: "5d",
		});

		res.status(200).json({
			message: "Login success",
			token,
			user,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export const myProfile = async (req: AuthenticatedRequest, res: any) => {
	// non eed to declare type of `res`. It's just a response!
	try {
		const user = req.user;
		res.json(user);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getUserProfile = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			res.status(404).json({
				message: "No user with this id",
			});
			return;
		}

		res.json(user);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateUser = async (req: AuthenticatedRequest, res: any) => {
	try {
		const { name, bio } = req.body;

		const user = await User.findByIdAndUpdate(
			req.user?._id,
			{
				name: name,
				bio: bio,
			},
			{ new: true }
		);

		// As info updated, generate new token and send to user
		const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
			expiresIn: "5d",
		});

		res.json({
			message: "User Updated",
			token,
			user,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateProfilePic = async (req: AuthenticatedRequest, res: any) => {
	try {
		const file = req.file;

		if (!file) {
			res.status(400).json({
				message: "No file to upload",
			});
			return;
		}

		// send the `file` object to getBuffer().
		// The returned `fileBuffer` object, shaped like:
		// {
		// 	fileName?: string;
		// 	mimetype?: string;
		// 	content?: string;
		// 	base64?: string;
		// 	buffer?: Buffer;
		// 	encode(fileName: string, handler?: DataURI.Callback): Promise<string | undefined>;
		// 	format(fileName: string, fileContent: DataURI.Input): DataURIParser;
		// 	private createMetadata;
		// }
		const fileBuffer = getBuffer(file);

		const cloudinary_upload_response = await cloudinary.uploader.upload(
			fileBuffer.content,
			{
				folder: "blogs",
			}
		);

		const user = await User.findByIdAndUpdate(
			req.user?._id,
			{
				image: cloudinary_upload_response.secure_url,
			},
			{ new: true }
		);

		// generate new toke for updated user info
		const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
			expiresIn: "5d",
		});

		res.json({
			message: "User Profile pic updated",
			token,
			user,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};
