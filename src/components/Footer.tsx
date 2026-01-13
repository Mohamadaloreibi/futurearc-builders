import futurarcLogo from "@/assets/futurearc-logo.png";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={futurarcLogo} 
              alt="Futurearc" 
              className="h-8 object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Futurearc Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
