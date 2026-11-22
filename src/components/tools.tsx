import { Check } from "lucide-react";
import { SelectServiceLink } from "@/components/select-service-link";
import { SERVICES, type ServiceId } from "@/lib/services";
import { cn } from "@/lib/utils";

export function Tools() {
  return (
    <section id="tools" className="scroll-mt-8 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
            Three tools, one agency.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Use one or all three. Each is set up for your agency by our team, so there&apos;s
            nothing to install and no long sign-up.
          </p>
        </div>

        <div className="mt-16 divide-y divide-border border-t border-border">
          {SERVICES.map((service, i) => (
            <article
              key={service.id}
              className="grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20"
            >
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <p className="text-[15px] font-medium text-teal">{service.stage}</p>
                <h3 className="mt-2 font-heading text-3xl font-semibold text-navy sm:text-4xl">
                  {service.name}
                </h3>
                <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink-soft">
                  {service.summary}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px] text-navy">
                      <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SelectServiceLink
                  service={service.id}
                  className="mt-8 inline-flex h-11 items-center rounded-md bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                >
                  Request access to {service.name}
                </SelectServiceLink>
              </div>
              <Preview id={service.id} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Small, illustrative sketches of each tool's main screen. Sample data only. */
function Preview({ id }: { id: ServiceId }) {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-border bg-offwhite p-3 shadow-[0_24px_48px_-28px_rgba(13,27,46,0.35)] sm:p-5"
    >
      <div className="rounded-lg border border-border bg-white p-4 sm:p-5">
        {id === "referral-portal" && <ReferralPreview />}
        {id === "rcm-dashboard" && <RcmPreview />}
        {id === "email-campaigns" && <EmailPreview />}
      </div>
      <p className="mt-2.5 px-1 text-xs text-ink-soft/80">Sample data</p>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  New: "bg-gold/15 text-[#8a6418]",
  "In intake": "bg-teal/10 text-teal",
  Accepted: "bg-navy text-white",
};

function ReferralPreview() {
  const rows = [
    { who: "M. R.", src: "St. Mary's discharge", by: "Dana K.", status: "New" },
    { who: "J. T.", src: "Dr. Alvarez office", by: "Priya S.", status: "In intake" },
    { who: "A. L.", src: "Family call", by: "Dana K.", status: "In intake" },
    { who: "R. B.", src: "Brookside rehab", by: "Marcus W.", status: "Accepted" },
  ];
  return (
    <>
      <div className="flex items-baseline justify-between">
        <p className="font-semibold text-navy">Referrals this week</p>
        <p className="text-sm text-ink-soft">12 total</p>
      </div>
      <ul className="mt-4 divide-y divide-border">
        {rows.map((r) => (
          <li key={r.who} className="flex items-center gap-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-offwhite text-xs font-semibold text-navy">
              {r.who.replace(/[ .]/g, "")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{r.src}</p>
              <p className="text-xs text-ink-soft">Sent by {r.by}</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[r.status])}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function RcmPreview() {
  const parts = [
    { label: "Paid", amount: "$184,200", pct: 78, color: "bg-teal" },
    { label: "Pending", amount: "$38,900", pct: 16, color: "bg-gold" },
    { label: "Denied", amount: "$13,400", pct: 6, color: "bg-navy" },
  ];
  const reasons = [
    ["Missing EVV visit match", 9],
    ["Authorization expired", 6],
    ["Eligibility not verified", 4],
  ] as const;
  return (
    <>
      <div className="flex items-baseline justify-between">
        <p className="font-semibold text-navy">October claims</p>
        <p className="text-sm text-ink-soft">$236,500 billed</p>
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full">
        {parts.map((p) => (
          <span key={p.label} className={p.color} style={{ width: `${p.pct}%` }} />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        {parts.map((p) => (
          <div key={p.label}>
            <dt className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className={cn("size-2 rounded-full", p.color)} />
              {p.label}
            </dt>
            <dd className="mt-1 text-base font-semibold text-navy tabular-nums sm:text-lg">{p.amount}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm font-medium text-navy">Top denial reasons</p>
      <ul className="mt-2 space-y-2">
        {reasons.map(([r, n]) => (
          <li key={r} className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">{r}</span>
            <span className="font-medium text-navy tabular-nums">{n} claims</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function EmailPreview() {
  return (
    <>
      <div className="flex items-baseline justify-between">
        <p className="font-semibold text-navy">Flu shot reminder</p>
        <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal">Sending</span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">To families and caregivers, 1,240 contacts</p>
      <div className="mt-5">
        <div className="flex justify-between text-xs text-ink-soft">
          <span>Batch 4 of 5</span>
          <span className="tabular-nums">992 sent</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-offwhite">
          <span className="block h-full w-4/5 rounded-full bg-teal" />
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4">
        {[
          ["Opened", "47%"],
          ["Bounced", "0.8%"],
          ["Unsubscribed", "3"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-ink-soft">{k}</dt>
            <dd className="mt-1 text-lg font-semibold text-navy tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
