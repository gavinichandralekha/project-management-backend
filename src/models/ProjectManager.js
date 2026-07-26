import mongoose from "mongoose";

const projectManagerSchema = new mongoose.Schema(
  {
    companyAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyAdmin",
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "PROJECT_MANAGER",
    },

    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ProjectManager",
  projectManagerSchema
);