import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import DevotionSection from "@/components/landing/DevotionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ScheduleSection from "@/components/landing/ScheduleSection";
import AboutSection from "@/components/landing/AboutSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DevotionSection />
      <FeaturesSection />
      <ScheduleSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
