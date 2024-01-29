import express from "express";
import passport from "passport";
import * as authController from "../controller/auth";
require("dotenv").config();
const router = express.Router();
router.post("/register", authController.register);
router.post("/register/verify", authController.verifyOTP);

router.post("/login", authController.login);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(
      `${process.env.CLIENT_URL}/login-success/${req.user?.id}/${req.user?.tokenLogin}`
    );
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
    scope: ["email"],
  })
);
router.get(
  "/facebook/callback",
  (req, res, next) => {
    passport.authenticate("facebook", (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(
      `${process.env.CLIENT_URL}/login-success/${req.user?.id}/${req.user?.tokenLogin}`
    );
  }
);
router.post("/login-success", authController.loginSuccess);
export default router;
