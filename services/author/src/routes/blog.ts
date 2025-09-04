import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import { createBlog, deleteBlog, updateBlog } from "../controllers/blog.js";

const router = express.Router();

router.post("/blog/new", isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);
router.delete("/blog/:id", isAuth, deleteBlog);
// todo
// router.post("/ai/title", aiTitleResponseController);
// todo
// router.post("/ai/descripiton", aiDescriptionResponseController);
// todo
// router.post("/ai/blog", aiBlogResponseController);

export default router;
