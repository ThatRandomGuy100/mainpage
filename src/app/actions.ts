"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { COMPANY, SERVICE_IDS, serviceName } from "@/lib/services";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  organization: z.string().trim().min(2, "Enter your agency or organization name").max(150),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Enter a phone number with area code"),
  email: z.email("Enter a valid email address").trim().max(200),
  services: z.array(z.enum(SERVICE_IDS)).min(1, "Pick at least one tool"),
});

export type RequestAccessState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof z.infer<typeof schema>, string>>;
      values?: Record<string, string | string[]>;
    };

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function requestAccess(
  _prev: RequestAccessState,
  formData: FormData,
): Promise<RequestAccessState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    services: formData.getAll("services").map(String),
  };

  // Honeypot: real people never see or fill this field.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", email: raw.email };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Some details need fixing before we can send your request.",
      fieldErrors,
      values: raw,
    };
  }

  const { name, organization, phone, email, services } = parsed.data;
  const to = (process.env.WAITLIST_NOTIFY_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (to.length === 0) {
    console.error("[requestAccess] WAITLIST_NOTIFY_TO is not set");
    return {
      status: "error",
      message: `Your request couldn't be sent. Email us at ${COMPANY.email} and we'll set you up.`,
      values: raw,
    };
  }

  const serviceList = services.map(serviceName);
  const rows: [string, string][] = [
    ["Name", name],
    ["Organization", organization],
    ["Phone", phone],
    ["Email", email],
    ["Wants access to", serviceList.join(", ")],
  ];

  const result = await sendEmail({
    to,
    replyTo: email,
    subject: `Access request: ${organization} (${serviceList.join(", ")})`,
    text: [
      "New access request from the Precision RCM landing page.",
      "",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      "Reply to this email to reach the requester directly.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#0D1B2E;max-width:560px">
        <h2 style="margin:0 0 4px">New access request</h2>
        <p style="margin:0 0 20px;color:#5B6472">From the Precision RCM landing page.</p>
        <table style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              ([k, v]) => `<tr>
                <td style="padding:8px 12px 8px 0;color:#5B6472;white-space:nowrap;vertical-align:top">${k}</td>
                <td style="padding:8px 0;font-weight:600">${escape(v)}</td>
              </tr>`,
            )
            .join("")}
        </table>
        <p style="margin:24px 0 0;color:#5B6472;font-size:13px">
          Reply to this email to reach ${escape(name)} directly. Turn the requested tools on for
          this organization in the database once you've spoken to them.
        </p>
      </div>`,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: `Your request couldn't be sent. Try again in a minute, or email us at ${COMPANY.email}.`,
      values: raw,
    };
  }

  return { status: "success", email };
}
