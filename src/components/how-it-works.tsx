const steps = [
  {
    title: "Tell us what you need",
    body: "Fill in the short form below with your agency's details and the tools you want.",
  },
  {
    title: "We get in touch",
    body: "Someone from our team calls or emails to confirm the setup for your agency.",
  },
  {
    title: "Your team signs in",
    body: "We switch the tools on for your agency and send your team their sign-in details.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-8 bg-offwhite">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <h2 className="max-w-xl font-heading text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
          Getting started takes one conversation.
        </h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-navy pt-5">
              <p className="font-heading text-3xl font-semibold text-gold">{i + 1}</p>
              <h3 className="mt-3 text-lg font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
