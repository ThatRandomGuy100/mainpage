"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { requestAccess, type RequestAccessState } from "@/app/actions";
import { SELECT_SERVICE_EVENT } from "@/components/select-service-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPANY, SERVICES, type ServiceId } from "@/lib/services";
import { cn } from "@/lib/utils";

const initial: RequestAccessState = { status: "idle" };

export function RequestAccess() {
  const [state, formAction, pending] = useActionState(requestAccess, initial);
  const [selected, setSelected] = useState<ServiceId[]>([]);

  // "Request access to X" buttons elsewhere on the page pre-tick X here.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<ServiceId>).detail;
      setSelected((cur) => (cur.includes(id) ? cur : [...cur, id]));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};
  const values = state.status === "error" ? state.values ?? {} : {};
  const val = (k: string) => (typeof values[k] === "string" ? (values[k] as string) : undefined);

  return (
    <section id="request-access" className="scroll-mt-4 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-28">
        <div className="max-w-md">
          <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Request access
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Tell us about your agency and which tools you want. We&apos;ll get in touch to set
            them up, usually within one business day.
          </p>
          <div className="mt-10 space-y-1 text-white/75">
            <p>Prefer to talk first?</p>
            <p>
              <a href={COMPANY.phoneHref} className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-gold">
                {COMPANY.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${COMPANY.email}`} className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-gold">
                {COMPANY.email}
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 text-navy shadow-2xl shadow-black/30 sm:p-8">
          {state.status === "success" ? (
            <div role="status" className="flex min-h-[420px] flex-col items-start justify-center">
              <CheckCircle2 className="size-10 text-teal" aria-hidden="true" />
              <h3 className="mt-5 font-heading text-3xl font-semibold">Request sent</h3>
              <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
                Thanks. We&apos;ll be in touch at <span className="font-medium text-navy">{state.email}</span> to
                set up your agency.
              </p>
            </div>
          ) : (
            <form action={formAction} noValidate className="grid gap-5">
              <fieldset>
                <legend className="text-sm font-medium">Which tools do you want?</legend>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                  {SERVICES.map((s) => {
                    const checked = selected.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-3 text-sm font-medium transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                          checked ? "border-teal bg-teal/5 text-teal" : "border-input hover:border-navy/40",
                        )}
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={s.id}
                          checked={checked}
                          onChange={(e) =>
                            setSelected((cur) =>
                              e.target.checked ? [...cur, s.id] : cur.filter((x) => x !== s.id),
                            )
                          }
                          className="size-4 accent-teal"
                        />
                        {s.name}
                      </label>
                    );
                  })}
                </div>
                <FieldError message={errors.services} />
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="name" label="Your name" autoComplete="name" defaultValue={val("name")} error={errors.name} />
                <Field
                  name="organization"
                  label="Agency or organization"
                  autoComplete="organization"
                  defaultValue={val("organization")}
                  error={errors.organization}
                />
                <Field
                  name="email"
                  type="email"
                  label="Work email"
                  autoComplete="email"
                  defaultValue={val("email")}
                  error={errors.email}
                />
                <Field
                  name="phone"
                  type="tel"
                  label="Phone number"
                  autoComplete="tel"
                  defaultValue={val("phone")}
                  error={errors.phone}
                />
              </div>

              {/* Honeypot for bots; hidden from people and screen readers. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {state.status === "error" && (
                <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal px-6 font-semibold text-white transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-70"
              >
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {pending ? "Sending request" : "Send request"}
              </button>
              <p className="text-xs leading-relaxed text-ink-soft">
                We only use these details to contact you about access. No marketing emails.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  error,
  ...props
}: { name: string; label: string; error?: string } & React.ComponentProps<"input">) {
  const id = `field-${name}`;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 text-[15px]"
        {...props}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-destructive">
      {message}
    </p>
  );
}
