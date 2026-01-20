import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SpacesSection } from "@/components/landing/SpacesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BrowseSection } from "@/components/landing/BrowseSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PromoSection } from "@/components/landing/PromoSection";
import { Footer } from "@/components/landing/Footer";

function HomeContent() {
  return (
    <div className="bg-background text-foreground antialiased">
      <Navbar />
      <HeroSection />
      <SpacesSection />
      <FeaturesSection />
      <BrowseSection />
      <TestimonialsSection />
      <PromoSection />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
