import bcrypt from "bcryptjs";

import SuperAdmin from "../models/SuperAdmin.js";
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