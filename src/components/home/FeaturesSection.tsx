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
    <section className="border-y border-border bg-muted/30 py-6 lg:py-8">
      <div className="container-custom">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group flex items-center gap-3 rounded-xl bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
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
    <section className="py-12 lg:py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-12 text-center lg:px-12 lg:py-16"
        >
          {/* Background decorations - Simplified */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
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
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm"
            >
              ✨ Exclusive Members Only
            </motion.div>
            
            <h2 className="font-display text-3xl tracking-tight text-primary-foreground lg:text-4xl">
              JOIN THE DRIP SQUAD
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/85 leading-relaxed lg:text-base">
              Get exclusive access to new releases, member-only discounts, and early drops. 
              Be the first to cop the freshest kicks.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="default" variant="secondary" className="h-11 px-8 text-sm font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
                <Link to="/auth">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}