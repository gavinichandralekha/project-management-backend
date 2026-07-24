import express from "express";

import { 
    createCompanyAdmin,
    loginCompanyAdmin,
 } from "../controllers/companyAdminController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginCompanyAdmin);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  createCompanyAdmin
);

export default router;