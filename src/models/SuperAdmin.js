import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },

    role: {
      type: String,
      default: "SUPER_ADMIN",
      enum: ["SUPER_ADMIN"],
    },

    status: {
      type: Number,
      default: 1,
      enum: [0, 1], // 1 = Active, 0 = Inactive
    },
  },
  {
    timestamps: true,
  }
);

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;