import express from "express";

import { loginSuperAdmin } from "../controllers/authController.js";

const router = express.Router();


router.post("/login", loginSuperAdmin);

export default router;