import express from "express";
import { register,login, getAllUsers } from "../controllers/AuthController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login)
router.get("/users", protect ,getAllUsers);

export default router;