import express from "express";
const router = express.Router();

import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getUser,
  updateUserData,
} from "../controllers/user.js";
import { verifyJWT } from "../middlewares/auth.js";

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/user-data").get(verifyJWT, getUser);
router.route("/update-account").put(verifyJWT, updateUserData);

export default router;
