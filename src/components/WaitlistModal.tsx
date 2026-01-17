import { useState } from "react";
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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from("waitlist_signups").insert({
      email,
      experience,
      interests: interests || null,
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already signed up",
          description: "This email is already on the waitlist.",
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-auto md:w-full md:max-w-lg"
          >
            <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 hero-gradient opacity-50" />
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <img
                            src={owlMascot}
                            alt="Futurearc Owl"
                            className="w-10 h-10"
                          />
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            Futurearc Academy
                          </h2>
                        </div>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                          Coming 2026
                        </span>
                        <p className="text-muted-foreground text-sm md:text-base">
                          Build real projects. Learn how developers think. Use AI the right way.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background/50 border-border focus:border-primary"
                          />
                        </div>

                        {/* Experience Level */}
                        <div className="space-y-3">
                          <Label className="text-foreground">Experience Level</Label>
                          <RadioGroup
                            value={experience}
                            onValueChange={setExperience}
                            className="flex flex-wrap gap-3"
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
                                  className="cursor-pointer px-4 py-2 rounded-lg border border-border bg-background/50 text-sm capitalize transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50"
                                >
                                  {level}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {/* Interests */}
                        <div className="space-y-2">
                          <Label htmlFor="interests" className="text-foreground">
                            What do you want to learn?{" "}
                            <span className="text-muted-foreground font-normal">(optional)</span>
                          </Label>
                          <Textarea
                            id="interests"
                            placeholder="e.g., Full-stack development, AI/ML, system design..."
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            className="bg-background/50 border-border focus:border-primary resize-none h-20"
                          />
                        </div>

                        {/* Submit */}
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 glow-primary"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                          ) : (
                            "Join the waitlist"
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                        className="mb-6"
                      >
                        <img
                          src={owlMascot}
                          alt="Futurearc Owl"
                          className="w-20 h-20 mx-auto"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="w-8 h-8 text-primary"
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
                        <h3 className="text-2xl font-bold text-foreground mb-2">
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
