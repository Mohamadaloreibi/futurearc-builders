import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";

const WaitlistForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    experience: "beginner",
    interests: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Welcome to Futurearc!",
      description: "You're officially on the waitlist. We'll be in touch.",
    });

    setFormData({ email: "", experience: "beginner", interests: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="waitlist" className="py-24 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Join the waitlist
            </h2>
            <p className="text-muted-foreground">
              Tell us a bit about yourself. It takes 30 seconds.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-2xl bg-card border border-border"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-11 bg-background border-border focus:border-primary"
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <Label>Experience level</Label>
              <RadioGroup
                value={formData.experience}
                onValueChange={(value) =>
                  setFormData({ ...formData, experience: value })
                }
                className="flex flex-wrap gap-3"
              >
                {[
                  { value: "beginner", label: "Beginner" },
                  { value: "junior", label: "Junior" },
                  { value: "intermediate", label: "Intermediate" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="px-4 py-2 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-muted-foreground/30"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label htmlFor="interests">What do you want to learn?</Label>
              <Textarea
                id="interests"
                placeholder="e.g., Full-stack development, AI integration, building SaaS..."
                value={formData.interests}
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
                className="min-h-[100px] bg-background border-border focus:border-primary resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 glow-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join the waitlist
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistForm;