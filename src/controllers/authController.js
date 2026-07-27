import bcrypt from "bcryptjs";

import SuperAdmin from "../models/SuperAdmin.js";
import CompanyAdmin from "../models/CompanyAdmin.js";
import ProjectManager from "../models/ProjectManager.js";
import TeamMember from "../models/TeamMember.js";
import generateToken from "../utils/generateToken.js";



export const loginSuperAdmin = async (req, res) => {

  try {

    const { email, password } = req.body;

    

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });

    }

    

    const admin = await SuperAdmin.findOne({ email });

    if (!admin) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }



    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    

    const token = generateToken(
      admin._id,
      admin.role
    );

    

    res.status(200).json({

      success: true,

      message: "Login Successful",

      token,

      user: {

        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,

      },

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    let user = null;

    // ==========================
    // Search Super Admin
    // ==========================

    user = await SuperAdmin.findOne({ email });

    console.log("SuperAdmin:", user);

    // ==========================
    // Search Company Admin
    // ==========================

    if (!user) {
      user = await CompanyAdmin.findOne({
        email,
        status: 1,
      });

      console.log("CompanyAdmin:", user);
    }

    // ==========================
    // Search Project Manager
    // ==========================

    if (!user) {
      user = await ProjectManager.findOne({
        email,
        status: 1,
      });

      console.log("ProjectManager:", user);
    }

    // ==========================
    // Search Team Member
    // ==========================

    if (!user) {
      user = await TeamMember.findOne({
        email,
        status: 1,
      });

      console.log("TeamMember:", user);
    }

    // ==========================
    // User Not Found
    // ==========================

    if (!user) {
      console.log("No user found in any collection.");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("User Found:", user);

    // ==========================
    // Compare Password
    // ==========================

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ==========================
    // Generate JWT
    // ==========================

    const token = generateToken(
      user._id,
      user.role
    );

    console.log("Generated Token Successfully");

    // ==========================
    // Success Response
    // ==========================

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        name: user.name || "",
        email: user.email,
        role: user.role,
        clientId: user.clientId || null,
      },
    });

  } catch (error) {

    console.log("Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};