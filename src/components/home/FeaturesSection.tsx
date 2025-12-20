import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over 1000",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected checkout",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-10 lg:py-14">
      <div className="container-custom">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group flex items-center gap-4 rounded-2xl bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2rem bg-linear-to-br from-primary via-primary to-primary px-8 py-16 text-center opacity-90 lg:px-16 lg:py-24"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm mb-6"
            >
              ✨ Exclusive Members Only
            </motion.div>
            
            <h2 className="font-display text-5xl tracking-tight text-primary-foreground lg:text-6xl">
              JOIN THE DRIP SQUAD
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/85 leading-relaxed">
              Get exclusive access to new releases, member-only discounts, and early drops. 
              Be the first to cop the freshest kicks.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-base font-semibold rounded-xl shadow-xl hover:scale-105 transition-all duration-300">
                <Link to="/auth">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}