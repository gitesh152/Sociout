import { Router } from "express";
const router = Router();
import passport from "passport";
import { toggleFriend, deleteFriend } from "../controllers/friendship_controller.js";

router.get(
  "/toggle",
  passport.checkAuthentication,
  toggleFriend
);
router.get(
  "/delete",
  passport.checkAuthentication,
  deleteFriend
);

export default router;
