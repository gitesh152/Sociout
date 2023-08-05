import { Router } from "express";
const router = Router();
import { toggleLike } from "../controllers/like_controller.js";
import passport from "passport";

router.get("/toggle", passport.checkAuthentication, toggleLike);

export default router;
