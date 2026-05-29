import { NextResponse } from "next/server";
import { getContactSettings } from "@/lib/pocketbase";
import { getSmtpConfig, sendContactEmail } from "@/lib/smtp";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const trimmedName = name.trim().slice(0, MAX_NAME);
  const trimmedEmail = email.trim().slice(0, MAX_EMAIL);
  const trimmedMessage = message.trim().slice(0, MAX_MESSAGE);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!getSmtpConfig()) {
    return NextResponse.json(
      { error: "Email is not configured on the server" },
      { status: 503 },
    );
  }

  const { contactEmail } = await getContactSettings();
  if (!contactEmail) {
    return NextResponse.json(
      { error: "Contact email is not configured in the CMS" },
      { status: 503 },
    );
  }

  try {
    await sendContactEmail({
      to: contactEmail,
      fromName: trimmedName,
      fromEmail: trimmedEmail,
      message: trimmedMessage,
    });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
