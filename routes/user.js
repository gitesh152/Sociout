import { Router } from "express";
const router = Router();
import { profile, update, changePassword, signIn, signUp, signOut, create, createSession, contact, faq } from "../controllers/user_controller.js";
import passport from "passport";

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  profile
);
router.post("/update/:id", passport.checkAuthentication, update);
router.post("/changePassword/:id", passport.checkAuthentication, changePassword);
router.get("/contact", passport.checkAuthentication, contact);
router.get("/faq", passport.checkAuthentication, faq);
router.get("/sign-in", signIn);
router.get("/sign-up", signUp);
router.get("/sign-out", signOut);
router.post("/create", create);
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/" }),
  createSession
);

export default router;
