import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import { createBlog, updateBlog } from "../controllers/blog.js";

const router = express.Router();

router.post("/blog/new", isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);
// todo
router.delete("/blog/:id", authMiddleware, deleteBlogController);
// todo
// router.post("/ai/title", aiTitleResponseController);
// todo
// router.post("/ai/descripiton", aiDescriptionResponseController);
// todo
// router.post("/ai/blog", aiBlogResponseController);

export default router;
