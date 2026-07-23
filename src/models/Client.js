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
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,

      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      
       match: [
        /^[0-9]{10}$/,
        "Phone Number must contain exactly 10 digits",
      ],
    },

    status: {
      type: Number,
      enum:{
        values: [0, 1],
        message: "Status must be 0 (Inactive) or 1 (Active)",
    },
    default:1,
  },
  },  
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;