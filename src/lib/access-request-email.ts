// HTML + text for the "new access request" notification sent to the team.
// Email clients need tables and inline styles, so this deliberately avoids CSS classes.

export type AccessRequest = {
  name: string;
  organization: string;
  phone: string;
  email: string;
  services: string[];
};

const C = {
  navy: "#0D1B2E",
  teal: "#0A6E6E",
  tealLight: "#5FC4C4",
  gold: "#C9962A",
  goldTint: "#FBF4E4",
  offwhite: "#F4F7F6",
  muted: "#5B6472",
  border: "#E3E8EC",
};

const serif = "Georgia,'Times New Roman',serif";
const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** "7041078346" -> "(704) 107-8346"; anything else is left as typed. */
export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  const us = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
  if (us.length === 10) return `(${us.slice(0, 3)}) ${us.slice(3, 6)}-${us.slice(6)}`;
  return raw.trim();
}

function telHref(raw: string) {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `tel:+1${d}` : `tel:+${d}`;
}

function submittedAt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(date);
}

export function accessRequestSubject(r: AccessRequest) {
  return `Access request: ${r.organization} (${r.services.join(", ")})`;
}

export function accessRequestText(r: AccessRequest, date = new Date()) {
  return [
    `New access request from ${r.organization}`,
    "",
    `Wants access to: ${r.services.join(", ")}`,
    "",
    `Name: ${r.name}`,
    `Organization: ${r.organization}`,
    `Phone: ${formatPhone(r.phone)}`,
    `Email: ${r.email}`,
    "",
    "Next steps:",
    `1. Reply to this email or call ${formatPhone(r.phone)} to confirm their setup.`,
    "2. Turn the requested tools on for this organization in the database.",
    "",
    `Submitted ${submittedAt(date)} from the Precision RCM landing page.`,
  ].join("\n");
}

export function accessRequestHtml(r: AccessRequest, date = new Date()) {
  const name = escape(r.name);
  const org = escape(r.organization);
  const email = escape(r.email);
  const phone = escape(formatPhone(r.phone));
  const replySubject = encodeURIComponent(`Your Precision RCM access request`);

  const pills = r.services
    .map(
      (s) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border-radius:999px;background:${C.goldTint};border:1px solid #EBD9AE;color:#7A5A14;font:600 13px/1 ${sans};">${escape(s)}</span>`,
    )
    .join("");

  const row = (label: string, value: string, last = false) => `
    <tr>
      <td style="padding:14px 0;${last ? "" : `border-bottom:1px solid ${C.border};`}font:14px/1.4 ${sans};color:${C.muted};width:130px;vertical-align:top;">${label}</td>
      <td style="padding:14px 0;${last ? "" : `border-bottom:1px solid ${C.border};`}font:600 15px/1.4 ${sans};color:${C.navy};vertical-align:top;">${value}</td>
    </tr>`;

  const link = (href: string, text: string) =>
    `<a href="${href}" style="color:${C.teal};text-decoration:none;">${text}</a>`;

  const button = (href: string, text: string, primary: boolean) => `
    <td style="padding:0 10px 10px 0;">
      <a href="${href}" style="display:inline-block;white-space:nowrap;padding:12px 20px;border-radius:8px;font:600 14px/1 ${sans};text-decoration:none;${
        primary
          ? `background:${C.teal};color:#ffffff;border:1px solid ${C.teal};`
          : `background:#ffffff;color:${C.navy};border:1px solid #C9D2D9;`
      }">${text}</a>
    </td>`;

  const step = (n: number, text: string) => `
    <tr>
      <td style="width:28px;vertical-align:top;padding:4px 0;">
        <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${C.navy};color:#ffffff;font:700 11px/20px ${sans};text-align:center;">${n}</span>
      </td>
      <td style="padding:4px 0;font:14px/1.5 ${sans};color:${C.navy};">${text}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>New access request</title>
</head>
<body style="margin:0;padding:0;background:${C.offwhite};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${org} wants access to ${escape(r.services.join(", "))}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.offwhite};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <tr>
            <td style="background:${C.navy};border-radius:12px 12px 0 0;padding:22px 32px;">
              <span style="font:700 22px/1 ${serif};color:#ffffff;">Precision</span><span style="font:700 22px/1 ${serif};color:${C.tealLight};margin-left:3px;">RCM</span>
            </td>
          </tr>
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:${C.gold};">&nbsp;</td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:32px 32px 8px;">
              <p style="margin:0 0 6px;font:600 13px/1.4 ${sans};color:${C.teal};">New access request</p>
              <h1 style="margin:0 0 18px;font:700 28px/1.2 ${serif};color:${C.navy};">${org}</h1>
              <p style="margin:0 0 10px;font:14px/1.4 ${sans};color:${C.muted};">Wants access to</p>
              <div>${pills}</div>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:16px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.border};">
                ${row("Name", name)}
                ${row("Organization", org)}
                ${row("Phone", link(telHref(r.phone), phone))}
                ${row("Email", link(`mailto:${email}`, email), true)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:20px 32px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  ${button(`mailto:${email}?subject=${replySubject}`, "Reply by email", true)}
                  ${button(telHref(r.phone), "Call", false)}
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:8px 32px 32px;border-radius:0 0 12px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.offwhite};border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 8px;font:700 14px/1.4 ${sans};color:${C.navy};">Next steps</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      ${step(1, "Reply or call to confirm their setup.")}
                      ${step(2, "Turn the requested tools on for this organization in the database.")}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 0;font:12px/1.6 ${sans};color:${C.muted};text-align:center;">
              Submitted ${escape(submittedAt(date))} from the Precision RCM landing page.<br>
              Replying to this email goes straight to ${email}.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
