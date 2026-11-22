import { cn } from "@/lib/utils";

export function Wordmark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("font-heading text-2xl font-bold tracking-tight", className)}>
      <span className={tone === "dark" ? "text-navy" : "text-white"}>Precision</span>
      <span className={cn("ml-[0.15em]", tone === "dark" ? "text-teal" : "text-teal-light")}>RCM</span>
    </span>
  );
}
