import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import CompanyAdmin from "../models/CompanyAdmin.js";
import Client from "../models/Client.js";

export const createCompanyAdmin = async (req, res) => {
  try {
    const {
      clientId,
      firstName,
      lastName,
      email,
      phoneNumber,
    } = req.body;

    // Validate Required Fields
    if (
      !clientId ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check Client Exists
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    
    const existingAdmin = await CompanyAdmin.findOne({
      email,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Company Admin already exists.",
      });
    }

    
    const temporaryPassword = "Admin@123";

    
    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    
    const admin = await CompanyAdmin.create({
      clientId,
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Company Admin created successfully.",
      temporaryPassword,
      data: adminResponse,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const loginCompanyAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

   
    const admin = await CompanyAdmin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    
    res.status(200).json({
      success: true,
      message: "Company Admin login successful.",
      token,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        clientId: admin.clientId,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};