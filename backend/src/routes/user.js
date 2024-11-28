import express from "express";
const router = express.Router();

import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/user.js";
import { verifyJWT } from "../middlewares/auth.js";

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
