import "server-only";
import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendEmail(opts: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const client = getResend();
  const from = process.env.EMAIL_FROM;
  if (!client || !from) {
    console.error("[email] RESEND_API_KEY or EMAIL_FROM is not set");
    return { ok: false as const, error: "Email is not configured" };
  }

  try {
    const { data, error } = await client.emails.send({ from, ...opts });
    if (error) {
      console.error("[email] Resend error", error.message);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] send failed", message);
    return { ok: false as const, error: message };
  }
}
