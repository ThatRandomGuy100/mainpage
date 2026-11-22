import { SelectServiceLink } from "@/components/select-service-link";
import { Wordmark } from "@/components/wordmark";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="#top" aria-label="Precision RCM home" className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          <Wordmark tone="light" />
        </a>
        <nav className="flex items-center gap-6 text-sm text-white/80">
          <a href="#tools" className="hidden hover:text-white sm:inline">
            Tools
          </a>
          <a href="#how-it-works" className="hidden hover:text-white sm:inline">
            How it works
          </a>
          <SelectServiceLink className="rounded-md border border-white/25 px-3.5 py-2 font-medium text-white transition-colors hover:border-gold hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            Request access
          </SelectServiceLink>
        </nav>
      </div>
    </header>
  );
}
