import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import HeroLanding from "@/components/HeroLanding";
import OwlMascot from "@/components/OwlMascot";
import WaitlistModal from "@/components/WaitlistModal";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {isAdmin && (
        <Link
          to="/admin"
          className="fixed top-4 right-4 z-50 p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-colors"
          title="Admin Dashboard"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Link>
      )}
      <HeroLanding />
      <OwlMascot onClick={() => setIsModalOpen(true)} />
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default Index;
