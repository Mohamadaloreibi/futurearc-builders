import { motion } from "framer-motion";
import { Lightbulb, Wrench, Users, Rocket } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "AI-driven learning paths",
    description: "Personalized curriculum that adapts to your pace and goals.",
  },
  {
    icon: Wrench,
    title: "Real-world projects",
    description: "No tutorials. Build actual products from day one.",
  },
  {
    icon: Users,
    title: "Community feedback",
    description: "Learn from peers. Review code. Iterate together.",
  },
  {
    icon: Rocket,
    title: "Learn by building",
    description: "Ship features, not just complete lessons.",
  },
];

const ValueSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            A different kind of learning
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built for people who want to become real developers, not just complete courses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 card-glow"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/20 transition-all duration-300">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
