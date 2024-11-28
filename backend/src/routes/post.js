import { Router } from "express";
import {
  allPosts,
  createPost,
  showPost,
  updatePost,
  deletePost,
} from "../controllers/post.js";
import { isOwner, verifyJWT } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
const router = Router();

router
  .route("/")
  .get(allPosts)
  .post(verifyJWT, upload.single("file"), createPost);

router
  .route("/:id")
  .get(showPost)
  .put(verifyJWT, upload.single("file"), isOwner, updatePost)
  .delete(verifyJWT, isOwner, deletePost);

router.route("/:id/edit").get(verifyJWT, isOwner, showPost);
export default router;
