import { motion } from "framer-motion";

const TrustSection = () => {
  return (
    <section className="py-16 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="w-2 h-2 rounded-full bg-primary/60" />
              <span className="w-2 h-2 rounded-full bg-accent/40" />
            </div>
            <span className="text-sm text-muted-foreground">
              Launching in 2026. Built in public by{" "}
              <span className="text-foreground font-medium">Futurearc</span>.
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-muted-foreground text-sm max-w-md mx-auto"
          >
            We're taking our time to build something meaningful. Quality over speed. Long-term thinking over quick wins.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
