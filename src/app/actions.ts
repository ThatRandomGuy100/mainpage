"use server";

import { z } from "zod";
import { accessRequestHtml, accessRequestSubject, accessRequestText } from "@/lib/access-request-email";
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

  const request = { name, organization, phone, email, services: services.map(serviceName) };

  const result = await sendEmail({
    to,
    replyTo: email,
    subject: accessRequestSubject(request),
    text: accessRequestText(request),
    html: accessRequestHtml(request),
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
