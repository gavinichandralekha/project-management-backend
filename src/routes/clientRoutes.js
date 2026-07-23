import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
} from "../controllers/clientController.js";
const router = express.Router();


router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);

export default router;