import multer from "multer";

const storage = multer.memoryStorage();
// memoryStorage -> for cloud
// diskStorage -> for disk storage

/**
 * Returns middleware that processes a single file associated with the
 * given form field.
 *
 * The `req` object will be populated with a `file` object containing
 * information about the processed file.
 *
 * @param fieldName Name of the multipart form field to process.
 */

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
