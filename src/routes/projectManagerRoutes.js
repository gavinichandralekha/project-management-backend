import express from "express";

import {
  createProjectManager,
  loginProjectManager,
  getProjectManagers,
  getProjectManagerById,
  updateProjectManager,
  deleteProjectManager,
  toggleProjectManagerStatus,
} from "../controllers/projectManagerController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginProjectManager);


router.post(
  "/",
  protect,
  authorize("COMPANY_ADMIN"),
  createProjectManager
);
router.get(
  "/",
  protect,
  authorize("COMPANY_ADMIN"),
  getProjectManagers
);
router.get(
  "/:id",
  protect,
  authorize("COMPANY_ADMIN"),
  getProjectManagerById
);
router.put(
  "/:id",
  protect,
  authorize("COMPANY_ADMIN"),
  updateProjectManager
);
router.patch(
  "/:id/status",
  protect,
  authorize("COMPANY_ADMIN"),
  toggleProjectManagerStatus
);
router.delete(
  "/:id",
  protect,
  authorize("COMPANY_ADMIN"),
  deleteProjectManager
);

export default router;