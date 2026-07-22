import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      trim: true,
    },

    companyCode: {
      type: String,
      required: [true, "Company Code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true,
    },

    subscriptionPlan: {
      type: String,
      required: [true, "Subscription Plan is required"],
      trim: true,
    },

    contactEmail: {
      type: String,
      required: [true, "Contact Email is required"],
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      trim: true,
    },

    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;