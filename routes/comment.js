import { Router } from "express";
const router = Router();
import { create, destroy } from "../controllers/comment_controller.js";
import passport from "passport";

router.post(
  "/createComment",
  passport.checkAuthentication,
  create
);
router.get(
  "/deleteComment/:id/:post",
  passport.checkAuthentication,
  destroy
);

export default router;
