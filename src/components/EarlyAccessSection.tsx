import { motion } from "framer-motion";
import { Check } from "lucide-react";

const benefits = [
  "First access before public launch",
  "Influence what gets built first",
  "Early member benefits at launch",
];

const EarlyAccessSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 section-fade" />
      
      <div className="container px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-accent bg-accent/10 rounded-full border border-accent/20">
              Limited spots
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Early access for builders
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Join before launch and help shape the future of developer education.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex flex-col gap-4 text-left"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EarlyAccessSection;
