import mongoose from "mongoose";

const companyAdminSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
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
      default: "COMPANY_ADMIN",
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

export default mongoose.model("CompanyAdmin", companyAdminSchema);