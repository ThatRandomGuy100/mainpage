"use client";

import type { ServiceId } from "@/lib/services";
import { cn } from "@/lib/utils";

export const SELECT_SERVICE_EVENT = "prcm:select-service";

/** Jumps to the request form and pre-ticks the given tool. */
export function SelectServiceLink({
  service,
  className,
  children,
}: {
  service?: ServiceId;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#request-access"
      className={cn(className)}
      onClick={() => {
        if (service) {
          window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: service }));
        }
      }}
    >
      {children}
    </a>
  );
}
