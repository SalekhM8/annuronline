import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "An-Nur Academy <info@an-nur.online>";
const SITE = process.env.NEXTAUTH_URL ?? "https://annur.online";

let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Branded shell for every outbound email (client requirement:
 * one standard template for all correspondence).
 */
export function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#faf7f0;font-family:Georgia,serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f0;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#0a3d2e;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
    <div style="color:#d4af37;font-size:22px;letter-spacing:1px;font-weight:bold;">An&#8209;Nur Academy</div>
    <div style="color:#e9d190;font-size:15px;margin-top:4px;" dir="rtl">&#1571;&#1603;&#1575;&#1583;&#1610;&#1605;&#1610;&#1577; &#1575;&#1604;&#1606;&#1608;&#1585;</div>
  </td></tr>
  <tr><td style="background:#ffffff;padding:32px;border:1px solid #e5ddc8;border-top:none;">
    <h1 style="color:#0a3d2e;font-size:20px;margin:0 0 16px;">${title}</h1>
    <div style="color:#1c2b26;font-size:15px;line-height:1.7;">${bodyHtml}</div>
  </td></tr>
  <tr><td style="background:#f3eee2;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;border:1px solid #e5ddc8;border-top:none;">
    <div style="color:#48594f;font-size:12px;line-height:1.6;">
      An&#8209;Nur Academy &bull; UK-based, worldwide access<br/>
      info@an-nur.online &bull; +44 7724 343150 &bull; <a href="${SITE}" style="color:#146b51;">${SITE.replace(/^https?:\/\//, "")}</a>
    </div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const client = getResend();
  if (!client) {
    console.log(`[email mock] to=${to} subject="${subject}"`);
    return true;
  }
  try {
    const { error } = await client.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Email send failed:", e);
    return false;
  }
}

const button = (href: string, label: string) =>
  `<p style="text-align:center;margin:24px 0;"><a href="${href}" style="background:#0e5540;color:#faf7f0;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:999px;display:inline-block;">${label}</a></p>`;

export function sendWelcomeEmail(to: string, firstName: string, mandateUrl: string) {
  return sendEmail(
    to,
    "Welcome to An-Nur Academy — set up your payment",
    emailShell(
      `Assalamu alaikum ${firstName},`,
      `<p>Welcome to An&#8209;Nur Academy! We are delighted to have you join our learning community.</p>
       <p>To complete your enrolment, please set up your monthly direct debit using the secure link below. Once your payment details are confirmed, your student portal login will be activated.</p>
       ${button(mandateUrl, "Set up Direct Debit")}
       <p>If you have any questions, simply reply to this email.</p>`
    )
  );
}

export function sendPortalReadyEmail(to: string, firstName: string, tempPassword: string) {
  return sendEmail(
    to,
    "Your An-Nur Academy student portal is ready",
    emailShell(
      `Assalamu alaikum ${firstName},`,
      `<p>Your student portal is now active. Sign in with:</p>
       <p><strong>Email:</strong> ${to}<br/><strong>Temporary password:</strong> ${tempPassword}</p>
       <p>Please change your password after your first login.</p>
       ${button(`${SITE}/login`, "Sign in to your portal")}`
    )
  );
}

export function sendInvoiceEmail(
  to: string,
  firstName: string,
  opts: { number: string; description: string; amount: string; dueDate: string; paid: boolean }
) {
  return sendEmail(
    to,
    opts.paid
      ? `Receipt ${opts.number} — payment received`
      : `Invoice ${opts.number} — ${opts.description}`,
    emailShell(
      opts.paid ? "Payment received — thank you" : "Your monthly invoice",
      `<p>Assalamu alaikum ${firstName},</p>
       <table style="width:100%;border-collapse:collapse;margin:16px 0;">
         <tr><td style="padding:8px 0;color:#48594f;">Invoice</td><td style="text-align:right;font-weight:bold;">${opts.number}</td></tr>
         <tr><td style="padding:8px 0;color:#48594f;">Description</td><td style="text-align:right;">${opts.description}</td></tr>
         <tr><td style="padding:8px 0;color:#48594f;">Amount</td><td style="text-align:right;font-weight:bold;">${opts.amount}</td></tr>
         <tr><td style="padding:8px 0;color:#48594f;">${opts.paid ? "Status" : "Due date"}</td><td style="text-align:right;">${opts.paid ? "PAID" : opts.dueDate}</td></tr>
       </table>
       ${opts.paid ? "<p>This is your receipt — no action is needed. JazakAllahu khairan.</p>" : `<p>Your fee will be collected by direct debit. If your payment cannot be collected within 7 days of the due date, portal access is paused until payment is made.</p>`}`
    )
  );
}

export function sendAccountLockedEmail(to: string, firstName: string) {
  return sendEmail(
    to,
    "An-Nur Academy — portal access paused",
    emailShell(
      "Portal access paused",
      `<p>Assalamu alaikum ${firstName},</p>
       <p>We could not collect your monthly fee, so access to your student portal has been temporarily paused. Once payment is made your access is restored straight away.</p>
       ${button(`${SITE}/student/fees`, "Review your fees")}
       <p>If you are experiencing difficulties, please contact us — we are always happy to help.</p>`
    )
  );
}

export function sendAbsenceEmail(to: string, studentName: string, className: string, date: string) {
  return sendEmail(
    to,
    `Absence noted — ${className}, ${date}`,
    emailShell(
      "We missed you in class",
      `<p>Assalamu alaikum,</p>
       <p>${studentName} was marked absent from <strong>${className}</strong> on <strong>${date}</strong>.</p>
       <p>Please reply to this email with a brief explanation of the absence, so we can keep our records up to date and support ${studentName}'s progress.</p>`
    )
  );
}

export function sendCertificateEmail(to: string, firstName: string, moduleTitle: string, certUrl: string) {
  return sendEmail(
    to,
    `Congratulations — ${moduleTitle} completed!`,
    emailShell(
      "Module completed — MashaAllah!",
      `<p>Assalamu alaikum ${firstName},</p>
       <p>Congratulations on completing <strong>${moduleTitle}</strong>. Your certificate is ready to download.</p>
       ${button(certUrl, "Download certificate")}`
    )
  );
}

export function sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
  return sendEmail(
    to,
    "Reset your An-Nur Academy password",
    emailShell(
      "Password reset",
      `<p>Assalamu alaikum ${firstName},</p>
       <p>We received a request to reset your password. The link below is valid for one hour.</p>
       ${button(resetUrl, "Reset password")}
       <p>If you did not request this, you can safely ignore this email.</p>`
    )
  );
}

export function sendAdminAlert(subject: string, bodyHtml: string) {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL ?? "an-nuracademy@outlook.com";
  return sendEmail(adminEmail, subject, emailShell(subject, bodyHtml));
}
