import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import owlMascot from "@/assets/owl-mascot.png";
import { z } from "zod";

// Validation schema matching database constraints
const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .email("Invalid email address"),
  experience: z.enum(["beginner", "junior", "intermediate"]),
  interests: z
    .string()
    .max(1000, "Interests must be less than 1000 characters")
    .nullable()
    .optional(),
});

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [interests, setInterests] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
        setShowBottomFade(isScrollable && !isAtBottom);
      }
    };

    checkScroll();
    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      scrollEl?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [isOpen, isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate input before submission
    const validationResult = waitlistSchema.safeParse({
      email: email.trim(),
      experience,
      interests: interests.trim() || null,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("waitlist_signups").insert({
      email: validationResult.data.email,
      experience: validationResult.data.experience,
      interests: validationResult.data.interests || null,
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already signed up",
          description: "This email is already on the waitlist.",
          variant: "destructive",
        });
      } else if (error.code === "23514") {
        // Check constraint violation
        toast({
          title: "Invalid input",
          description: "Please check your email format and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset form after animation completes
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
      setExperience("beginner");
      setInterests("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-3 top-[2vh] bottom-[2vh] md:inset-x-auto md:top-[5vh] md:bottom-[5vh] md:left-1/2 md:-translate-x-1/2 z-50 w-auto md:w-full md:max-w-md flex flex-col"
          >
            <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col h-full">
              {/* Background gradient */}
              <div className="absolute inset-0 hero-gradient opacity-50 pointer-events-none" />
              
              {/* Sticky Header */}
              <div className="relative z-20 bg-card/95 backdrop-blur-sm border-b border-border/50 p-3 md:p-4 flex-shrink-0">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted z-10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center pr-8">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <img
                      src={owlMascot}
                      alt="Futurearc Owl"
                      className="w-7 h-7"
                    />
                    <h2 className="text-lg md:text-xl font-bold text-foreground">
                      Futurearc Academy
                    </h2>
                  </div>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    Coming 2026
                  </span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div 
                ref={scrollRef}
                className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-4 md:p-5 pb-2"
              >
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-muted-foreground text-xs md:text-sm text-center mb-4">
                        Build real projects. Learn how developers think. Use AI the right way.
                      </p>

                      {/* Form */}
                      <div className="space-y-2">
                        {/* Email */}
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-foreground text-sm">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background/50 border-border focus:border-primary h-9"
                          />
                        </div>

                        {/* Experience Level */}
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Experience Level</Label>
                          <RadioGroup
                            value={experience}
                            onValueChange={setExperience}
                            className="flex flex-wrap gap-2"
                          >
                            {["beginner", "junior", "intermediate"].map((level) => (
                              <div key={level} className="flex items-center">
                                <RadioGroupItem
                                  value={level}
                                  id={level}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={level}
                                  className="cursor-pointer px-3 py-1.5 rounded-md border border-border bg-background/50 text-xs capitalize transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50"
                                >
                                  {level}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {/* Interests */}
                        <div className="space-y-1">
                          <Label htmlFor="interests" className="text-foreground text-sm">
                            What do you want to learn?{" "}
                            <span className="text-muted-foreground font-normal">(optional)</span>
                          </Label>
                          <Textarea
                            id="interests"
                            placeholder="e.g., Full-stack development, AI/ML..."
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            maxLength={1000}
                            className="bg-background/50 border-border focus:border-primary resize-none h-14 text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                        className="mb-4"
                      >
                        <img
                          src={owlMascot}
                          alt="Futurearc Owl"
                          className="w-16 h-16 mx-auto"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                          <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="w-6 h-6 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          You're early.
                        </h3>
                        <p className="text-muted-foreground">
                          Welcome to the builders list.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Bottom fade indicator */}
              <div 
                className={`absolute bottom-14 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-20 transition-opacity duration-200 ${showBottomFade ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Sticky Submit Button */}
              {!isSubmitted && (
                <div className="relative z-20 bg-card/95 backdrop-blur-sm border-t border-border/50 p-3 md:p-4 flex-shrink-0">
                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 glow-primary"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        "Join the waitlist"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
