import express from "express";

import { 
    createCompanyAdmin,
    loginCompanyAdmin,
    getCompanyAdmins,
    getCompanyAdminDropdown,
    getCompanyAdminById,
    updateCompanyAdmin,
    deleteCompanyAdmin,
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

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  getCompanyAdmins
);
router.get(
  "/dropdown",
  protect,
  authorize("COMPANY_ADMIN"),
  getCompanyAdminDropdown
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  getCompanyAdminById
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  updateCompanyAdmin
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteCompanyAdmin
);


export default router;