import { SelectServiceLink } from "@/components/select-service-link";
import { SERVICES } from "@/lib/services";

/*
 * The hero's one memorable thing: the three tools drawn as stations on a single loop,
 * the way an agency's revenue actually moves. A referral becomes a patient, the patient's
 * visits become paid claims, and outreach brings in the next referral.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 pt-32 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:pt-40 lg:pb-28">
        <div className="max-w-xl">
          <h1 className="font-heading text-[2.6rem] leading-[1.08] font-semibold tracking-tight sm:text-6xl">
            Software for home-care agencies, from the team that does your billing.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            Three tools that follow a patient from the day the referral arrives to the day the
            claim is paid, plus the outreach that brings in the next one. Ask for the ones you
            need and we switch them on for your agency.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <SelectServiceLink className="inline-flex h-12 items-center rounded-md bg-gold px-6 font-semibold text-navy transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Request access
            </SelectServiceLink>
            <a
              href="#tools"
              className="inline-flex h-12 items-center rounded-md px-2 font-medium text-white/85 underline decoration-white/30 underline-offset-[6px] hover:text-white hover:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See the three tools
            </a>
          </div>
        </div>

        <RevenueLoop />
      </div>
    </section>
  );
}

function RevenueLoop() {
  // Station positions in a 360×420 box; the loop path passes through each dot.
  const stations = [
    { x: 60, y: 60 },
    { x: 60, y: 210 },
    { x: 60, y: 360 },
  ];
  const path =
    "M60 60 L60 360 C60 405 110 410 180 410 C300 410 320 360 320 210 C320 60 300 12 180 12 C110 12 60 15 60 60";

  return (
    <figure aria-label="How the three tools connect" className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px]">
      <svg viewBox="0 0 360 420" className="h-auto w-full" aria-hidden="true">
        <path d={path} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <path
          d={path}
          fill="none"
          stroke="#C9962A"
          strokeWidth="2"
          strokeLinecap="round"
          className="loop-path"
          style={{ ["--loop-length" as string]: 1260 }}
        />
        {stations.map((s, i) => (
          <g key={i} className="loop-station" style={{ animationDelay: `${0.5 + i * 0.45}s` }}>
            <circle cx={s.x} cy={s.y} r="16" fill="#0D1B2E" stroke="#C9962A" strokeWidth="2" />
            <circle cx={s.x} cy={s.y} r="5" fill="#C9962A" />
          </g>
        ))}
      </svg>

      <ol className="absolute inset-0">
        {SERVICES.map((s, i) => (
          <li
            key={s.id}
            className="loop-station absolute left-[27%] -translate-y-1/2"
            style={{ top: `${(stations[i].y / 420) * 100}%`, animationDelay: `${0.5 + i * 0.45}s` }}
          >
            <p className="text-[15px] leading-tight text-white/60">{s.stage}</p>
            <p className="font-heading text-xl font-semibold text-white">{s.name}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
