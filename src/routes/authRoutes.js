import express from "express";

import {
  loginSuperAdmin,
  login,
} from "../controllers/authController.js";

const router = express.Router();

// Existing Super Admin Login
router.post("/super-admin/login", loginSuperAdmin);

// New Unified Login
router.post("/login", login);

export default router;