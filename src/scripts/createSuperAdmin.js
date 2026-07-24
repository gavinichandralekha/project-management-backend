import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

console.log("🚀 Script Started");

import connectDB from "../config/db.js";
import SuperAdmin from "../models/SuperAdmin.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    
    await connectDB();

    
    const existingAdmin = await SuperAdmin.findOne({
      email: "superadmin@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Super Admin already exists.");
      process.exit();
    }


    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    
    await SuperAdmin.create({
      name: "Platform Super Admin",
      email: "superadmin@gmail.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: 1,
    });

    console.log("✅ Super Admin created successfully.");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();