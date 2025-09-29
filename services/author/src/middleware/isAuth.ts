import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// interface IUser extends Document {
// 	_id: string;
// 	name: string;
// 	email: string;
// 	image: string;
// 	bio: string;
// }

// export interface AuthenticatedRequest extends Request {
// 	user?: IUser | null;
// }

export const isAuth = async (req: any, res: any, next: any): Promise<void> => {
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

		console.log("isAuth -> decoded user object: ", decodeValue);
		// decoded `user` object:
		//{
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
