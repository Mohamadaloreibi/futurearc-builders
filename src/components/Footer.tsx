const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">F</span>
            </div>
            <span className="text-sm font-medium">Futurearc</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Futurearc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;