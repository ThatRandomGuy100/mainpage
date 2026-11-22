import { Wordmark } from "@/components/wordmark";
import { COMPANY } from "@/lib/services";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="border-t border-white/10 bg-navy text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Wordmark tone="light" className="text-xl" />
          <p className="mt-2">© {year} Precision RCM LLC</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <a href={COMPANY.phoneHref} className="hover:text-white">
            {COMPANY.phone}
          </a>
          <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
            {COMPANY.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
