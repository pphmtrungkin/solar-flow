import nodemailer from "nodemailer";
import { env } from "@solar-sales/env/server";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASSWORD,
  },
});

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  from?: string,
) {
  try {
    await transporter.sendMail({
      from: from ?? env.GMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(error);
  }
}
