import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  subject,
  text,
}: {
  subject: string;
  text: string;
}): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.MY_EMAIL) {
    console.warn("Email configuration incomplete, skipping email send");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.MY_EMAIL,
      subject,
      text,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
