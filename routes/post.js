import { Router } from "express";
const router = Router();
import { createPost, deletePost } from "../controllers/post_controller.js";
import passport from "passport";

router.post(
  "/createPost",
  passport.checkAuthentication,
  createPost
);
router.get(
  "/deletePost/:id",
  passport.checkAuthentication,
  deletePost
);

export default router;
