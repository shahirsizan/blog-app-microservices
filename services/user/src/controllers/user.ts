import User from "../model/User.js";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/isAuth.js";

import { Request, Response } from "express";

export const loginUser = async (req: Request, res: Response) => {
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

export const myProfile = async (req: AuthenticatedRequest, res) => {
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
