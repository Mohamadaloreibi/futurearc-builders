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
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative bg-card border border-border rounded-2xl px-4 py-3 shadow-lg max-w-[180px]"
          >
            <p className="text-sm text-foreground font-medium">
              Psst… want early access?
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border rotate-45 transform" />
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owl Container */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
        initial={{ y: 0 }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open waitlist form"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Owl image */}
        <motion.img
          src={owlMascot}
          alt="Futurearc Owl Mascot"
          className="w-20 h-20 md:w-24 md:h-24 relative z-10 drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.3))" }}
          animate={{
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.button>
    </div>
  );
};

export default OwlMascot;
