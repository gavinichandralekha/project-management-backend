import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import ProjectManager from "../models/ProjectManager.js";
import CompanyAdmin from "../models/CompanyAdmin.js";
import sendEmail from "../utils/sendEmail.js";

export const createProjectManager = async (req, res) => {
  try {
    const {
      companyAdminId,
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      designation,
    } = req.body;

    // Validate Required Fields
    if (
      !companyAdminId ||
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

   
    const companyAdmin = await CompanyAdmin.findById(
      companyAdminId
    );

    if (!companyAdmin) {
      return res.status(404).json({
        success: false,
        message: "Company Admin not found.",
      });
    }

    
    const existingProjectManager =
      await ProjectManager.findOne({ email });

    if (existingProjectManager) {
      return res.status(400).json({
        success: false,
        message: "Project Manager already exists.",
      });
    }

    
    const temporaryPassword = "Manager@123";

    // Hash Password
    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    
    const projectManager =
        await ProjectManager.create({
        clientId: companyAdmin.clientId,
        companyAdminId,
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        designation,
        password: hashedPassword,
      });

    const responseData = projectManager.toObject();

    delete responseData.password;

    // Email Message
    const emailMessage = `
      <h2>Welcome to Project Management System</h2>

      <p>Hello <b>${firstName} ${lastName}</b>,</p>

      <p>Your Project Manager account has been created.</p>

      <h3>Login Credentials</h3>

      <p><b>Email:</b> ${email}</p>

      <p><b>Password:</b> ${temporaryPassword}</p>

      <p>Please change your password after login.</p>

      <hr>

      <p>Project Management System</p>
    `;

    await sendEmail({
      email,
      subject: "Project Manager Account Created",
      message: emailMessage,
    });

    res.status(201).json({
      success: true,
      message: "Project Manager created successfully.",
      data: responseData,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Project Manager Login
// ==============================

export const loginProjectManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find Project Manager
    const projectManager = await ProjectManager.findOne({
      email,
    });

    if (!projectManager) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      projectManager.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    
    const token = jwt.sign(
      {
        id: projectManager._id,
        role: projectManager.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Project Manager login successful.",
      token,
      user: {
        id: projectManager._id,
        companyAdminId: projectManager.companyAdminId,
        firstName: projectManager.firstName,
        lastName: projectManager.lastName,
        email: projectManager.email,
        role: projectManager.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get All Project Managers
// ==========================================

export const getProjectManagers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const searchFilter = {
      status: 1,
      $or: [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phoneNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const totalProjectManagers =
      await ProjectManager.countDocuments(searchFilter);

    const projectManagers =
      await ProjectManager.find(searchFilter)
        .select("-password")
        .populate(
          "companyAdminId",
          "firstName lastName email"
        )
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Project Managers fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(
        totalProjectManagers / limit
      ),
      totalProjectManagers,
      count: projectManagers.length,
      data: projectManagers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get Project Manager By ID
// ==========================================

export const getProjectManagerById = async (req, res) => {
  try {
    const { id } = req.params;

    const projectManager = await ProjectManager.findById(id)
      .select("-password")
      .populate(
        "companyAdminId",
        "firstName lastName email"
      );

    if (!projectManager) {
      return res.status(404).json({
        success: false,
        message: "Project Manager not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: projectManager,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Update Project Manager
// ==========================================

export const updateProjectManager = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyAdminId,
      status,
      department,
      designation,
    } = req.body;

    // Find Project Manager
    const projectManager =
      await ProjectManager.findById(id);

    if (!projectManager) {
      return res.status(404).json({
        success: false,
        message: "Project Manager not found.",
      });
    }

    // Check Duplicate Email
    if (
      email &&
      email !== projectManager.email
    ) {
      const existingProjectManager =
        await ProjectManager.findOne({ email });

      if (existingProjectManager) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // Update Fields
    projectManager.firstName =
      firstName || projectManager.firstName;

    projectManager.lastName =
      lastName || projectManager.lastName;

    projectManager.email =
      email || projectManager.email;

    projectManager.phoneNumber =
      phoneNumber || projectManager.phoneNumber;

    projectManager.companyAdminId =
      companyAdminId ||
      projectManager.companyAdminId;

    projectManager.status =
      status ?? projectManager.status;
    
    projectManager.department =
      department ||
      projectManager.department; 
      
    projectManager.designation =
      designation||
      projectManager.designation;  

    await projectManager.save();

    const updatedProjectManager =
      await ProjectManager.findById(id)
        .select("-password")
        .populate(
          "companyAdminId",
          "firstName lastName email"
        );

    res.status(200).json({
      success: true,
      message:
        "Project Manager updated successfully.",
      data: updatedProjectManager,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Delete Project Manager (Soft Delete)


export const deleteProjectManager = async (req, res) => {
  try {
    const { id } = req.params;

    const projectManager = await ProjectManager.findById(id);

    if (!projectManager) {
      return res.status(404).json({
        success: false,
        message: "Project Manager not found.",
      });
    }

    // Soft Delete
    projectManager.status = 0;

    await projectManager.save();

    res.status(200).json({
      success: true,
      message: "Project Manager deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Activate / Deactivate Project Manager
// ==========================================

export const toggleProjectManagerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const projectManager = await ProjectManager.findById(id);

    if (!projectManager) {
      return res.status(404).json({
        success: false,
        message: "Project Manager not found.",
      });
    }

    // Toggle status
    projectManager.status = projectManager.status === 1 ? 0 : 1;

    await projectManager.save();

    res.status(200).json({
      success: true,
      message:
        projectManager.status === 1
          ? "Project Manager activated successfully."
          : "Project Manager deactivated successfully.",
      data: projectManager,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

