import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Register Client Routes
app.use("/api/clients", clientRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Project Management API Running...");
});

export default app;