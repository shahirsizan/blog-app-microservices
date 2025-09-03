import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
	name: string;
	email: string;
	image: string;
	bio: string;
}

export interface AuthenticatedRequest extends Request {
	user?: IUser | null;
}

export const isAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		console.log(authHeader);

		if (!authHeader) {
			res.status(401).json({
				message: "Please Login - No auth header",
			});
			return;
		}

		const token = authHeader.split(" ")[1];

		const decodeValue = jwt.verify(
			token,
			process.env.JWT_SEC as string
		) as JwtPayload;

		if (!decodeValue) {
			res.status(401).json({
				message: "Invalid token",
			});
			return;
		}

		// append `user` object to `req` and pass to next()
		req.user = decodeValue.user;
		next();
	} catch (error) {
		console.log("JWT verification error: ", error);
		res.status(401).json({
			message: "Please Login - Jwt error",
		});
	}
};
