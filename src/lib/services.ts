// Single source of truth for the three products.
// Names are working titles: rename here and the whole page (and the email) follows.

export const SERVICES = [
  {
    id: "referral-portal",
    name: "Referral Portal",
    stage: "A referral comes in",
    summary:
      "One place for your marketers to send referrals and for your intake team to work them, so no patient gets lost between a phone call and a start of care.",
    features: [
      "Marketers submit referrals from the web or their phone",
      "Intake sees every referral with its documents and status",
      "Track each marketer's referrals and bonuses",
      "Each agency's data is kept separate and private",
    ],
  },
  {
    id: "rcm-dashboard",
    name: "RCM Dashboard",
    stage: "The claim gets paid",
    summary:
      "See where your money is: what's been paid, what's still pending and what was denied, with the reason, updated from the billing files we work every week.",
    features: [
      "Paid, pending and denied claims at a glance",
      "Denial reasons so you know what to fix",
      "Payroll view next to your billing",
      "Share a read-only report with your owners",
    ],
  },
  {
    id: "email-campaigns",
    name: "Email Campaigns",
    stage: "Families hear from you",
    summary:
      "Stay in touch with families, caregivers and referral partners. Upload a contact list, write the email and we send it in batches that land in inboxes.",
    features: [
      "Upload contacts from a spreadsheet",
      "Scheduled sends in batches",
      "Opens and sends tracked per campaign",
      "Unsubscribes handled for you",
    ],
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

export function serviceName(id: ServiceId) {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

export const COMPANY = {
  name: "Precision RCM",
  phone: "(848) 388-3566",
  phoneHref: "tel:+18483883566",
  email: "account@precisionrcmllc.com",
} as const;
