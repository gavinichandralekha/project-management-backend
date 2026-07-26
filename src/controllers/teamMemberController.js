import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import TeamMember from "../models/TeamMember.js";
import CompanyAdmin from "../models/CompanyAdmin.js";
import ProjectManager from "../models/ProjectManager.js";

import sendEmail from "../utils/sendEmail.js";

// ==========================================
// Create Team Member
// ==========================================

export const createTeamMember = async (req, res) => {
  try {
    const {
      companyAdminId,
      projectManagerId,
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      designation,
    } = req.body;

    // Validate Input
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

    // Check Company Admin
    const companyAdmin = await CompanyAdmin.findById(
      companyAdminId
    );

    if (!companyAdmin) {
      return res.status(404).json({
        success: false,
        message: "Company Admin not found.",
      });
    }

    // Check Project Manager (Optional)
    if (projectManagerId) {
      const projectManager =
        await ProjectManager.findById(projectManagerId);

      if (!projectManager) {
        return res.status(404).json({
          success: false,
          message: "Project Manager not found.",
        });
      }
    }

    // Duplicate Email
    const existingTeamMember =
      await TeamMember.findOne({ email });

    if (existingTeamMember) {
      return res.status(400).json({
        success: false,
        message: "Team Member already exists.",
      });
    }

    // Temporary Password
    const temporaryPassword = "Member@123";

    // Hash Password
    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    // Create Team Member
    const teamMember =
      await TeamMember.create({
        clientId: projectManager.clientId,
        companyAdminId: projectManager.companyAdminId,
        projectManagerId,
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        designation,
        password: hashedPassword,
      });

    const responseData = teamMember.toObject();

    delete responseData.password;

    // Email
    const emailMessage = `
      <h2>Welcome to Project Management System</h2>

      <p>Hello <b>${firstName} ${lastName}</b>,</p>

      <p>Your Team Member account has been created.</p>

      <h3>Login Credentials</h3>

      <p>Email : ${email}</p>

      <p>Password : ${temporaryPassword}</p>

      <p>Please change your password after login.</p>

      <hr>

      <p>Project Management System</p>
    `;

    await sendEmail({
      email,
      subject: "Team Member Account Created",
      message: emailMessage,
    });

    res.status(201).json({
      success: true,
      message: "Team Member created successfully.",
      data: responseData,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Get All Team Members
// ==========================================

export const getTeamMembers = async (req, res) => {
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

    const totalTeamMembers =
      await TeamMember.countDocuments(searchFilter);

    const teamMembers =
      await TeamMember.find(searchFilter)
        .select("-password")
        .populate(
          "companyAdminId",
          "firstName lastName email"
        )
        .populate(
          "projectManagerId",
          "firstName lastName email"
        )
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Team Members fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(totalTeamMembers / limit),
      totalTeamMembers,
      count: teamMembers.length,
      data: teamMembers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Get Team Member By ID
// ==========================================

export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id)
      .select("-password")
      .populate(
        "companyAdminId",
        "firstName lastName email"
      )
      .populate(
        "projectManagerId",
        "firstName lastName email"
      );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team Member not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Update Team Member
// ==========================================

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      projectManagerId,
      firstName,
      lastName,
      email,
      phoneNumber,
      status,
      department,
      designation,
    } = req.body;

    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team Member not found.",
      });
    }

    // Check Duplicate Email
    const existingEmail = await TeamMember.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Validate Project Manager (Optional)
    if (projectManagerId) {
      const projectManager =
        await ProjectManager.findById(projectManagerId);

      if (!projectManager) {
        return res.status(404).json({
          success: false,
          message: "Project Manager not found.",
        });
      }

      teamMember.projectManagerId = projectManagerId;
    }

    teamMember.firstName = firstName;
    teamMember.lastName = lastName;
    teamMember.email = email;
    teamMember.phoneNumber = phoneNumber;
    teamMember.status = status;
    teamMember.department = department;
    teamMember.designation = designation;

    await teamMember.save();

    const responseData = teamMember.toObject();

    delete responseData.password;

    res.status(200).json({
      success: true,
      message: "Team Member updated successfully.",
      data: responseData,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Delete Team Member (Soft Delete)
// ==========================================

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team Member not found.",
      });
    }

    // Soft Delete
    teamMember.status = 0;

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: "Team Member deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Team Member Login
// ==========================================

export const loginTeamMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find Team Member
    const teamMember = await TeamMember.findOne({ email });

    if (!teamMember) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check Account Status
    if (teamMember.status === 0) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      teamMember.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: teamMember._id,
        role: teamMember.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Team Member login successful.",
      token,
      user: {
        id: teamMember._id,
        companyAdminId: teamMember.companyAdminId,
        projectManagerId: teamMember.projectManagerId,
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
        email: teamMember.email,
        role: teamMember.role,
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
// Activate / Deactivate Team Member
// ==========================================

export const toggleTeamMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team Member not found.",
      });
    }

    // Toggle Status
    teamMember.status = teamMember.status === 1 ? 0 : 1;

    await teamMember.save();

    res.status(200).json({
      success: true,
      message:
        teamMember.status === 1
          ? "Team Member activated successfully."
          : "Team Member deactivated successfully.",
      data: teamMember,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Fix Existing Team Members (One Time)
// ==========================================

export const fixTeamMemberClientIds = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();

    let updatedCount = 0;

    for (const teamMember of teamMembers) {
      if (!teamMember.clientId) {
        const projectManager = await ProjectManager.findById(
          teamMember.projectManagerId
        );

        if (projectManager) {
          teamMember.clientId = projectManager.clientId;
          teamMember.companyAdminId =
            projectManager.companyAdminId;

          await teamMember.save();

          updatedCount++;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `${updatedCount} Team Members updated successfully.`,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};