import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import CompanyAdmin from "../models/CompanyAdmin.js";
import Client from "../models/Client.js";
import sendEmail from "../utils/sendEmail.js";

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

    console.log("Incoming Email:", email);

const existingAdmin = await CompanyAdmin.findOne({ email });

console.log("Existing Admin:", existingAdmin);

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

    // Create Company Admin
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

const emailMessage = `
<h2>Welcome to Project Management System</h2>

<p>Hello <b>${firstName} ${lastName}</b>,</p>

<p>Your Company Admin account has been created successfully.</p>

<h3>Login Credentials</h3>

<p><b>Email:</b> ${email}</p>

<p><b>Password:</b> ${temporaryPassword}</p>

<p>Please login and change your password immediately.</p>

<hr>

<p>Project Management System</p>
`;

await sendEmail({
  email,
  subject: "Company Admin Account Created",
  message: emailMessage,
});

res.status(201).json({
  success: true,
  message:
    "Company Admin created successfully. Email invitation sent.",
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




export const getCompanyAdmins = async (req, res) => {
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

    const totalCompanyAdmins =
      await CompanyAdmin.countDocuments(searchFilter);

    const companyAdmins = await CompanyAdmin.find(searchFilter)
      .select("-password")
      .populate("clientId", "companyName companyCode")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Company Admins fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(totalCompanyAdmins / limit),
      totalCompanyAdmins,
      count: companyAdmins.length,
      data: companyAdmins,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const getCompanyAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const companyAdmin = await CompanyAdmin.findById(id)
      .select("-password")
      .populate("clientId", "companyName companyCode");

    if (!companyAdmin) {
      return res.status(404).json({
        success: false,
        message: "Company Admin not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: companyAdmin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




export const updateCompanyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      clientId,
      status,
    } = req.body;

    const companyAdmin = await CompanyAdmin.findById(id);

    if (!companyAdmin) {
      return res.status(404).json({
        success: false,
        message: "Company Admin not found.",
      });
    }

    
    if (email && email !== companyAdmin.email) {
      const existingAdmin = await CompanyAdmin.findOne({ email });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    companyAdmin.firstName =
      firstName || companyAdmin.firstName;

    companyAdmin.lastName =
      lastName || companyAdmin.lastName;

    companyAdmin.email =
      email || companyAdmin.email;

    companyAdmin.phoneNumber =
      phoneNumber || companyAdmin.phoneNumber;

    companyAdmin.clientId =
      clientId || companyAdmin.clientId;

    companyAdmin.status =
      status ?? companyAdmin.status;

    await companyAdmin.save();

    const updatedAdmin = await CompanyAdmin.findById(id)
      .select("-password")
      .populate("clientId", "companyName companyCode");

    res.status(200).json({
      success: true,
      message: "Company Admin updated successfully.",
      data: updatedAdmin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const deleteCompanyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const companyAdmin = await CompanyAdmin.findById(id);

    if (!companyAdmin) {
      return res.status(404).json({
        success: false,
        message: "Company Admin not found.",
      });
    }

    companyAdmin.status = 0;

    await companyAdmin.save();

    res.status(200).json({
      success: true,
      message: "Company Admin deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
