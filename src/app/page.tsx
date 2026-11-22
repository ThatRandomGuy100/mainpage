import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { RequestAccess } from "@/components/request-access";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tools } from "@/components/tools";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Tools />
        <HowItWorks />
        <RequestAccess />
      </main>
      <SiteFooter />
    </>
  );
}
