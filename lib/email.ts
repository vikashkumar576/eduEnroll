import nodemailer from "nodemailer";
import { IEnrollment } from "@/models/Enrollment";

// ──────────────────────────────────────────────
// Transporter (configure once, reuse)
// ──────────────────────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured in environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function formatAmount(paise: number, currency = "INR"): string {
  const amount = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

// ──────────────────────────────────────────────
// Shared HTML layout wrapper
// ──────────────────────────────────────────────
function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Viku Academy</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                🎓 Viku Academy
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Viku Academy · If you have questions, reply to this email.<br/>
                © ${new Date().getFullYear()} Viku Academy. All rights reserved.
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

// ──────────────────────────────────────────────
// Success Email — with Invoice Table
// ──────────────────────────────────────────────
function buildSuccessHtml(enrollment: IEnrollment): string {
  const content = `
    <!-- Badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <span style="display:inline-block;background:#d1fae5;color:#065f46;
                   border-radius:999px;padding:6px 18px;font-size:13px;font-weight:600;">
        ✅ Payment Successful
      </span>
    </div>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
      You're enrolled, ${enrollment.customerName.split(" ")[0]}!
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
      Your enrollment in <strong style="color:#7c3aed;">${enrollment.courseName}</strong>
      has been confirmed. Here's your payment receipt.
    </p>

    <!-- Invoice Box -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:28px;">
      <tr style="background:#f9fafb;">
        <td colspan="2" style="padding:14px 20px;font-size:13px;font-weight:600;
                                color:#374151;border-bottom:1px solid #e5e7eb;">
          INVOICE / RECEIPT
        </td>
      </tr>
      ${[
        ["Enrollment ID",   enrollment.enrollmentId],
        ["Course",          enrollment.courseName],
        ["Payment ID",      enrollment.razorpayPaymentId || "—"],
        ["Order ID",        enrollment.razorpayOrderId],
        ["Date & Time",     formatDate(enrollment.paidAt || enrollment.updatedAt)],
        ["Amount Paid",     `<strong style="color:#059669;">${formatAmount(enrollment.amountPaise, enrollment.currency)}</strong>`],
        ["Status",          `<span style="background:#d1fae5;color:#065f46;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;">PAID</span>`],
      ].map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? "background:#ffffff;" : "background:#f9fafb;"}">
          <td style="padding:12px 20px;font-size:13px;color:#6b7280;width:42%;border-bottom:1px solid #f3f4f6;">
            ${label}
          </td>
          <td style="padding:12px 20px;font-size:13px;color:#111827;border-bottom:1px solid #f3f4f6;">
            ${value}
          </td>
        </tr>
      `).join("")}
    </table>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "#"}/courses"
         style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);
                color:#ffffff;text-decoration:none;padding:14px 32px;
                border-radius:10px;font-weight:600;font-size:15px;">
        Access Your Course →
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
      Keep this email as your payment receipt. No action required.
    </p>
  `;
  return emailLayout(content);
}

// ──────────────────────────────────────────────
// Failure Email
// ──────────────────────────────────────────────
function buildFailureHtml(enrollment: IEnrollment): string {
  const content = `
    <!-- Badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <span style="display:inline-block;background:#fee2e2;color:#991b1b;
                   border-radius:999px;padding:6px 18px;font-size:13px;font-weight:600;">
        ❌ Payment Failed
      </span>
    </div>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
      Payment was unsuccessful
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
      Hi ${enrollment.customerName.split(" ")[0]}, unfortunately your payment for
      <strong style="color:#7c3aed;">${enrollment.courseName}</strong> could not be processed.
      <strong>No amount has been deducted.</strong>
    </p>

    <!-- Details Box -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid #fecaca;border-radius:12px;overflow:hidden;margin-bottom:28px;background:#fff5f5;">
      <tr style="background:#fee2e2;">
        <td colspan="2" style="padding:14px 20px;font-size:13px;font-weight:600;
                                color:#991b1b;border-bottom:1px solid #fecaca;">
          PAYMENT DETAILS
        </td>
      </tr>
      ${[
        ["Enrollment ID", enrollment.enrollmentId],
        ["Course",        enrollment.courseName],
        ["Order ID",      enrollment.razorpayOrderId],
        ["Amount",        formatAmount(enrollment.amountPaise, enrollment.currency)],
        ["Reason",        enrollment.failureReason || "Payment not completed"],
        ["Status",        `<span style="background:#fee2e2;color:#991b1b;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;">FAILED</span>`],
      ].map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? "background:#fff5f5;" : "background:#fef2f2;"}">
          <td style="padding:12px 20px;font-size:13px;color:#6b7280;width:42%;border-bottom:1px solid #fecaca;">
            ${label}
          </td>
          <td style="padding:12px 20px;font-size:13px;color:#111827;border-bottom:1px solid #fecaca;">
            ${value}
          </td>
        </tr>
      `).join("")}
    </table>

    <!-- CTA — Retry -->
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "#"}/enroll/${enrollment.courseId}"
         style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);
                color:#ffffff;text-decoration:none;padding:14px 32px;
                border-radius:10px;font-weight:600;font-size:15px;">
        Retry Enrollment →
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
      If money was deducted from your account, it will be refunded within 5–7 business days.
    </p>
  `;
  return emailLayout(content);
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────
const FROM = `"Viku Academy" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`;

export async function sendSuccessEmail(enrollment: IEnrollment): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: FROM,
    to: enrollment.customerEmail,
    subject: `✅ Enrollment Confirmed — ${enrollment.courseName}`,
    html: buildSuccessHtml(enrollment),
  });
  console.log(`[email] Success email sent to ${enrollment.customerEmail}`);
}

export async function sendFailureEmail(enrollment: IEnrollment): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: FROM,
    to: enrollment.customerEmail,
    subject: `❌ Payment Failed — ${enrollment.courseName}`,
    html: buildFailureHtml(enrollment),
  });
  console.log(`[email] Failure email sent to ${enrollment.customerEmail}`);
}
