import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded" : "Missing"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"Project Management System" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

export default sendEmail;