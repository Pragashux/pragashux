import { AboutSection } from "@/components/home/AboutSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { ProcessSection } from "@/components/home/ProcessSection";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Timeline } from "@/components/home/Timeline";
import { WhyIDesign } from "@/components/home/WhyIDesign";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Timeline />
      <SelectedWork />
      <ProcessSection />
      <WhyIDesign />
      <AboutSection />
      <Experience />
      <ContactCTA />
    </>
  );
}
