import DataUriParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: any) => {
	const parser = new DataUriParser();

	const extName = path.extname(file.originalname);
	const dataURI = parser.format(extName, file.buffer);

	return dataURI;
};

export default getBuffer;
