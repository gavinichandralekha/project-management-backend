import express from "express";

import {
  createTeamMember,
  loginTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  fixTeamMemberClientIds,
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
router.patch(
  "/:id/status",
  protect,
  authorize("COMPANY_ADMIN"),
  toggleTeamMemberStatus
);
router.patch(
  "/fix-clientids",
  protect,
  authorize("COMPANY_ADMIN"),
  fixTeamMemberClientIds
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