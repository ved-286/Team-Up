import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  updateProfile,
  changePassword,
  getProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/me").get(protect, getProfile);
router.route("/update-profile").put(protect, updateProfile);
router.route("/change-password").put(protect, changePassword);

export default router;