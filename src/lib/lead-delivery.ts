import nodemailer from "nodemailer";
import { ValidLead } from "@/lib/lead-schema";

function formatLeadMessage(lead: ValidLead): string {
  return [
    `New lead (${lead.locale})`,
    `Name: ${lead.name}`,
    `Contact: ${lead.contact}`,
    `Inquiry type: ${lead.inquiryType}`,
    `Entity slug: ${lead.entitySlug ?? "-"}`,
    `Consent: ${lead.consent ? "yes" : "no"}`,
    `Message: ${lead.message || "-"}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
}

export async function sendLeadToTelegram(lead: ValidLead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return false;
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadMessage(lead),
    }),
  });

  return response.ok;
}

async function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? "587");

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendLeadToEmail(lead: ValidLead): Promise<boolean> {
  const to = process.env.LEADS_EMAIL_TO;
  const from = process.env.LEADS_EMAIL_FROM ?? process.env.SMTP_USER;

  if (!to || !from) {
    return false;
  }

  const transporter = await createTransporter();

  if (!transporter) {
    return false;
  }

  const result = await transporter.sendMail({
    from,
    to,
    subject: `[My Gudauri] Lead: ${lead.inquiryType}`,
    text: formatLeadMessage(lead),
  });

  return Boolean(result.messageId);
}

export function hasLeadChannelConfigured() {
  const telegramConfigured =
    Boolean(process.env.TELEGRAM_BOT_TOKEN) && Boolean(process.env.TELEGRAM_CHAT_ID);
  const emailConfigured =
    Boolean(process.env.SMTP_HOST) &&
    Boolean(process.env.SMTP_USER) &&
    Boolean(process.env.SMTP_PASS) &&
    Boolean(process.env.LEADS_EMAIL_TO);

  return { telegramConfigured, emailConfigured };
}
