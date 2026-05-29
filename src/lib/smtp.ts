import nodemailer from "nodemailer";

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  secure: boolean;
};

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;

  if (!host || !user || !password || !from) {
    return null;
  }

  return {
    host,
    port,
    user,
    password,
    from,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
  };
}

export async function sendContactEmail(options: {
  to: string;
  fromName: string;
  fromEmail: string;
  message: string;
}): Promise<void> {
  const smtp = getSmtpConfig();
  if (!smtp) {
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.password,
    },
  });

  await transporter.sendMail({
    from: smtp.from,
    to: options.to,
    replyTo: options.fromEmail,
    subject: `Portfolio contact from ${options.fromName}`,
    text: [
      `Name: ${options.fromName}`,
      `Email: ${options.fromEmail}`,
      "",
      options.message,
    ].join("\n"),
    html: `
      <p><strong>Name:</strong> ${escapeHtml(options.fromName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(options.fromEmail)}</p>
      <hr />
      <p>${escapeHtml(options.message).replace(/\n/g, "<br />")}</p>
    `,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
