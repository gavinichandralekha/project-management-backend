import express from "express";
import { createClient } from "../controllers/clientController.js";

const router = express.Router();


router.post("/", createClient);

export default router;