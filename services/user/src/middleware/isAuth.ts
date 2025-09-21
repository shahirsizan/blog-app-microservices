import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/User.js";

// export interface AuthenticatedRequest extends Request {
// 	user?: IUser | null;
// }

export const isAuth = async (req: any, res: any, next: any): Promise<void> => {
	try {
		const authToken = req.headers.authorization;
		console.log(authToken);

		if (!authToken) {
			res.status(401).json({
				message: "❌ No Authorization Token - Please Login",
			});
			return;
		}

		const token = authToken.split(" ")[1];

		const decodedValue = jwt.verify(
			token,
			process.env.JWT_SEC as string
		) as JwtPayload;

		if (!decodedValue) {
			res.status(401).json({
				message: "Invalid token",
			});
			return;
		}

		// append `user` object to `req` and pass to next()
		req.user = decodedValue.user;
		next();
	} catch (error) {
		console.log("⚠️ Bearer token empty - Please Login: ", error);
		res.status(401).json({
			message: "⚠️ Bearer token empty - Please Login",
		});
	}
};
