import DataUriParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: any) => {
	// When you use Multer, each uploaded file is represented in `req.file` like this:
	// 	{
	//   fieldname: 'image',
	//   originalname: 'profile.png',
	//   encoding: '7bit',
	//   mimetype: 'image/png',
	//   buffer: <Buffer ... >,  // raw binary data
	//   size: 12345
	// }

	const parser = new DataUriParser();

	const extName = path.extname(file.originalname);
	const dataURI = parser.format(extName, file.buffer);

	// the dataURI object, usually shaped like this:
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
	return dataURI;
};

export default getBuffer;
