import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import owlMascot from "@/assets/owl-mascot.png";

interface OwlMascotProps {
  onClick: () => void;
}

const OwlMascot = ({ onClick }: OwlMascotProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  return (
    <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 flex flex-col items-end gap-4">
      {/* Speech Bubble - more refined */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 1.5, ease: "easeOut" }}
            className="relative bg-card/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2.5 shadow-xl max-w-[160px]"
          >
            <p className="text-xs text-muted-foreground tracking-wide">
              Psst… want early access?
            </p>
            {/* Subtle bubble tail */}
            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-card/90 border-r border-b border-border/50 rotate-45 transform" />
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-muted/80 backdrop-blur rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-[10px] leading-none">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owl Container - more subtle, premium feel */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full p-2"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open waitlist form"
      >
        {/* Subtle ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: isHovered ? 1.8 : 1.4,
            opacity: isHovered ? 1 : 0.6,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Owl image - cleaner styling */}
        <motion.img
          src={owlMascot}
          alt="Futurearc Owl"
          className="w-16 h-16 md:w-18 md:h-18 relative z-10"
          style={{ 
            filter: isHovered 
              ? "drop-shadow(0 8px 24px hsl(var(--primary) / 0.25))" 
              : "drop-shadow(0 4px 12px hsl(var(--primary) / 0.15))",
            transition: "filter 0.4s ease"
          }}
        />

        {/* Single refined pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          animate={{
            scale: [1, 1.6],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.button>
    </div>
  );
};

export default OwlMascot;
