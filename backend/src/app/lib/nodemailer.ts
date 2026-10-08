import nodemailer from "nodemailer";
import config from "../config";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.smtp_user,// the email you used to create app password
    pass: config.smtp_password,// your generated app password
  },
});