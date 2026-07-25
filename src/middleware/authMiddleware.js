import jwt from "jsonwebtoken";

import SuperAdmin from "../models/SuperAdmin.js";
import CompanyAdmin from "../models/CompanyAdmin.js";



export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing.",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    // Check Role
    if (decoded.role === "SUPER_ADMIN") {
      user = await SuperAdmin.findById(decoded.id).select("-password");
    }

    if (decoded.role === "COMPANY_ADMIN") {
      user = await CompanyAdmin.findById(decoded.id).select("-password");
    }

    // User Not Found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach User
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  };
};