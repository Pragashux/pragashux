import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { CaseStudiesSection } from "@/components/sections/case-studies";
import { DesignProcessSection } from "@/components/sections/design-process";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { AchievementsSection } from "@/components/sections/achievements";
import { BlogSection } from "@/components/sections/blog";
import { ContactSection } from "@/components/sections/contact";
import { siteConfig } from "@/lib/data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "Senior Technical Consultant UX",
  worksFor: {
    "@type": "Organization",
    name: siteConfig.company,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  description: siteConfig.tagline,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.image}`,
  sameAs: [
    siteConfig.linkedin,
    siteConfig.behance,
    siteConfig.dribbble,
    siteConfig.github,
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <CaseStudiesSection />
        <DesignProcessSection />
        <TestimonialsSection />
        <AchievementsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
