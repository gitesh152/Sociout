import express from "express";
const router = express.Router();
import homeController from "../controllers/home_controller.js";
import { createSession } from "../controllers/user_controller.js";
import passport from "passport";
import userRoute from './user.js'
import postRoute from './post.js'
import commentRoute from './comment.js'
import likeRoute from './like.js'
import friendshipRoute from './friendship.js'
import apiRoute from './api/index.js'


router.get("/", homeController);
router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/comment", commentRoute);
router.use("/like", likeRoute);
router.use("/friendship", friendshipRoute);
router.use("/api", apiRoute);

//Google-oAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback*",
  passport.authenticate("google", { failureRedirect: "/" }),
  createSession
);

export default router;
