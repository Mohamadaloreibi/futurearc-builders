import HeroSection from "@/components/HeroSection";
import ValueSection from "@/components/ValueSection";
import EarlyAccessSection from "@/components/EarlyAccessSection";
import WaitlistForm from "@/components/WaitlistForm";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <HeroSection />
      <ValueSection />
      <EarlyAccessSection />
      <WaitlistForm />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
