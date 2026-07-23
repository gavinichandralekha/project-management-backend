import express from "express";
import {
  createClient,
  getClients,
  getClientById,
} from "../controllers/clientController.js";
const router = express.Router();


router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);

export default router;