import jwt from "jsonwebtoken";
import SuperAdmin from "../models/SuperAdmin.js";



export const protect = async (req, res, next) => {
  try {
    let token;

    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing.",
      });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const admin = await SuperAdmin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = admin;

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
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    
    next();
  };
};