// app/api/contact/route.ts
//
// Handles POST /api/contact
// Sends an email notification via Gmail using nodemailer + App Password.
// Env vars required (set in .env.local):
//   GMAIL_USER            — the Gmail address that sends the email
//   GMAIL_APP_PASSWORD    — 16-char Gmail App Password (not account password)
//   NEXT_PUBLIC_CONTACT_EMAIL — inbox that receives the notification

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { automexFetch } from "@/lib/automex/client";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ContactPayload {
  name:     string;
  company?: string;
  email:    string;
  subject:  string;
  message:  string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────────────────────────────────────

function validate(body: unknown): ContactPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body.");
  }

  const b = body as Record<string, unknown>;

  const name    = typeof b.name    === "string" ? b.name.trim()    : "";
  const email   = typeof b.email   === "string" ? b.email.trim()   : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  const company = typeof b.company === "string" ? b.company.trim() : undefined;

  if (!name)    throw new Error("Name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email address is required.");
  }
  if (!subject) throw new Error("Subject is required.");
  if (!message) throw new Error("Message is required.");
  if (message.length > 5000) throw new Error("Message is too long.");

  return { name, company, email, subject, message };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML email template
// ─────────────────────────────────────────────────────────────────────────────

function buildHtml(payload: ContactPayload): string {
  const { name, company, email, subject, message } = payload;
  const safe = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission — IDWE</title>
</head>
<body style="margin:0;padding:0;background:#f8fbff;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d8e5f0;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0ab8fb 0%,#324b9d 100%);padding:32px 36px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.03em;">
                IDWE
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
                New contact form submission
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Subject banner -->
                <tr>
                  <td style="background:#eaf4ff;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#56697f;">Subject</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#0c1b33;">${safe(subject)}</p>
                  </td>
                </tr>

                <tr><td style="height:24px;"></td></tr>

                <!-- Fields -->
                ${[
                  ["Name",    safe(name)],
                  ["Email",   safe(email)],
                  ...(company ? [["Company", safe(company)]] : []),
                ]
                  .map(
                    ([label, value]) => `
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 3px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#56697f;">${label}</p>
                    <p style="margin:0;font-size:14px;color:#0c1b33;">${value}</p>
                  </td>
                </tr>`,
                  )
                  .join("")}

                <!-- Message -->
                <tr>
                  <td style="padding-top:8px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#56697f;">Message</p>
                    <div style="background:#f8fbff;border-radius:10px;padding:16px 18px;border:1px solid #d8e5f0;">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#0c1b33;white-space:pre-wrap;">${safe(message)}</p>
                    </div>
                  </td>
                </tr>

                <!-- Reply CTA -->
                <tr>
                  <td style="padding-top:28px;">
                    <a href="mailto:${safe(email)}"
                       style="display:inline-block;background:linear-gradient(90deg,#0ab8fb 0%,#324b9d 100%);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:10px;padding:12px 24px;">
                      Reply to ${safe(name)}
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fbff;border-top:1px solid #d8e5f0;padding:20px 36px;">
              <p style="margin:0;font-size:11px;color:#56697f;">
                This email was sent from the contact form at
                <a href="https://idwe.tech/contact" style="color:#245ea9;text-decoration:none;">idwe.tech/contact</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // 2. Validate
  let payload: ContactPayload;
  try {
    payload = validate(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Validation failed.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  // 3. Check env vars
  const gmailUser     = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  const toEmail       = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? gmailUser;

  if (!gmailUser || !gmailPassword) {
    console.error("[contact] Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  // 4. Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  // 5. Send email
  try {
    await transporter.sendMail({
      from:    `"IDWE Contact Form" <${gmailUser}>`,
      to:      toEmail,
      replyTo: `"${payload.name}" <${payload.email}>`,
      subject: `[IDWE Contact] ${payload.subject} — ${payload.name}`,
      html:    buildHtml(payload),
      text: [
        `New contact form submission`,
        ``,
        `Name:    ${payload.name}`,
        `Email:   ${payload.email}`,
        payload.company ? `Company: ${payload.company}` : "",
        `Subject: ${payload.subject}`,
        ``,
        `Message:`,
        payload.message,
      ]
        .filter((l) => l !== undefined)
        .join("\n"),
    });

    // 6. Also submit to the CRM API so the lead is tracked in the pipeline.
    //    Fire-and-forget — CRM failure must not block the email response.
    const crmMessage = payload.subject
      ? `[${payload.subject}] ${payload.message}`
      : payload.message;

    automexFetch("/crm/leads/contact/", {
      method: "POST",
      body: JSON.stringify({
        full_name: payload.name,
        email: payload.email,
        company: payload.company,
        message: crmMessage,
        language: "en",
        source_page: "contact-form",
      }),
    }).catch((err) => {
      console.warn("[contact] CRM submission failed (email was sent successfully):", err.message);
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }
}