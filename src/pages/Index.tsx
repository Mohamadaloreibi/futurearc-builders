import { useState } from "react";
import HeroLanding from "@/components/HeroLanding";
import OwlMascot from "@/components/OwlMascot";
import WaitlistModal from "@/components/WaitlistModal";
import Footer from "@/components/Footer";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <HeroLanding />
      <OwlMascot onClick={() => setIsModalOpen(true)} />
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default Index;
