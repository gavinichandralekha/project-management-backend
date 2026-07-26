import express from "express";

import {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  loginTeamMember,
} from "../controllers/teamMemberController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/login", loginTeamMember);

router.get(
  "/",
  protect,
  authorize("COMPANY_ADMIN"),
  getTeamMembers
);
router.get(
  "/:id",
  protect,
  authorize("COMPANY_ADMIN"),
  getTeamMemberById
);
router.put(
  "/:id",
  protect,
  authorize("COMPANY_ADMIN"),
  updateTeamMember
);
router.delete(
  "/:id",
  protect,
  authorize("COMPANY_ADMIN"),
  deleteTeamMember
);
router.post(
  "/",
  protect,
  authorize("COMPANY_ADMIN"),
  createTeamMember
);


export default router;