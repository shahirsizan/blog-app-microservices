import multer from "multer";

const storage = multer.memoryStorage();
// memoryStorage -> for cloud
// diskStorage -> for disk storage

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
