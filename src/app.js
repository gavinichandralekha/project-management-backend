import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import companyAdminRoutes from "./routes/companyAdminRoutes.js";
import projectManagerRoutes from "./routes/projectManagerRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/company-admin", companyAdminRoutes);
app.use("/api/project-manager", projectManagerRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Project Management API Running...");
});

export default app;