import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./src/config/db.js";

import SuperAdmin from "./src/models/SuperAdmin.js";
import Client from "./src/models/Client.js";
import CompanyAdmin from "./src/models/CompanyAdmin.js";

dotenv.config();

const seedDatabase = async () => {
  try {

    await connectDB();

    console.log("==================================");
    console.log("Seeding Database...");
    console.log("==================================");

    // ==================================
    // SUPER ADMIN
    // ==================================

    let superAdmin = await SuperAdmin.findOne({
      email: "superadmin@gmail.com",
    });

    if (!superAdmin) {

      const hashedPassword = await bcrypt.hash(
        "Admin@123",
        10
      );

      superAdmin = await SuperAdmin.create({
        name: "Platform Super Admin",
        email: "superadmin@gmail.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      });

      console.log("✅ Super Admin Created");

    } else {

      console.log("✔ Super Admin Already Exists");

    }

    // ==================================
    // CLIENT
    // ==================================

    let client = await Client.findOne({
      companyCode: "ABC001",
    });

    if (!client) {

      client = await Client.create({
        companyName: "ABC Technologies",
        companyCode: "ABC001",
        industry: "IT",
        subscriptionPlan: "Premium",
        contactEmail: "contact@abctech.com",
        phoneNumber: "9876543210",
        status: 1,
      });

      console.log("✅ Client Created");

    } else {

      console.log("✔ Client Already Exists");

    }

    // ==================================
    // COMPANY ADMIN
    // ==================================

    let companyAdmin = await CompanyAdmin.findOne({
      email: "john@company.com",
    });

    if (!companyAdmin) {

      const hashedPassword = await bcrypt.hash(
        "Admin@123",
        10
      );

      companyAdmin = await CompanyAdmin.create({
        clientId: client._id,
        firstName: "John",
        lastName: "Doe",
        email: "john@company.com",
        phoneNumber: "9876543210",
        password: hashedPassword,
        role: "COMPANY_ADMIN",
        status: 1,
      });

      console.log("✅ Company Admin Created");

    } else {

      console.log("✔ Company Admin Already Exists");

    }

    console.log("\n==================================");
    console.log("Database Seed Completed");
    console.log("==================================");

    console.log("\nSUPER ADMIN");

    console.log("Email    : superadmin@gmail.com");
    console.log("Password : Admin@123");

    console.log("\nCOMPANY ADMIN");

    console.log("Email    : john@company.com");
    console.log("Password : Admin@123");

    console.log("\n==================================");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
};

seedDatabase();