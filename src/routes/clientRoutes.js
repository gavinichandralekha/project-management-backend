import express from "express";
import { protect,authorize } from "../middleware/authMiddleware.js";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
const router = express.Router();

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  getClients
);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  createClient
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  getClientById
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  updateClient
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteClient
);


export default router;