import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Premium background with layered gradients */}
      <div className="absolute inset-0 bg-(image:--gradient-hero)" />
      
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -right-32 -top-32 h-175 w-175 rounded-full bg-primary blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute -bottom-32 -left-32 h-150 w-150 rounded-full bg-accent blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground) / 0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 flex min-h-[90vh] items-center">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                New Collection 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl"
            >
              STEP INTO
              <br />
              <span className="text-gradient">YOUR STYLE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Discover premium sneakers and footwear crafted for those who dare to stand out. 
              Elevate every step with SoleDrip.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="group h-14 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <Link to="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-xl border-2 hover:bg-foreground hover:text-background transition-all duration-300">
                <Link to="/new">
                  New Arrivals
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-14 flex gap-10 lg:gap-12"
            >
              {[
                { value: "500+", label: "Premium Brands" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.9", label: "Rating", icon: <Star className="h-4 w-4 fill-primary text-primary inline ml-1" /> },
              ].map((stat, i) => (
                <div key={i} className="relative">
                  <p className="font-display text-4xl lg:text-5xl">
                    {stat.value}
                    {stat.icon}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:flex lg:items-center lg:justify-center"
          >
            <div className="relative aspect-square w-full max-w-xl">
              {/* Outer glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.3), transparent, hsl(var(--accent) / 0.2), transparent)',
                }}
              />
              
              {/* Inner container */}
              <div className="absolute inset-8 rounded-full bg-linear-to-br from-muted/80 to-background/40 backdrop-blur-sm border border-border/50">
                {/* Floating shoe placeholder */}
                <motion.div
                  animate={{ y: [0, -25, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative">
                    <div className="flex h-64 w-64 items-center justify-center rounded-full bg-linear-to-br from-primary/20 via-accent/10 to-primary/5 shadow-2xl">
                      <span className="font-display text-8xl opacity-50">👟</span>
                    </div>
                    {/* Reflection */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-16 w-48 rounded-full bg-foreground/5 blur-xl" />
                  </div>
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-0 top-1/4 glass-card px-4 py-3"
              >
                <p className="text-sm font-medium">🔥 Hot Deal</p>
                <p className="text-xs text-muted-foreground">Save up to 40%</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-0 glass-card px-4 py-3"
              >
                <p className="text-sm font-medium">⚡ Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders $100+</p>
              </motion.div>

              {/* Decorative circles */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute left-4 top-1/3 h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
                <div className="absolute right-8 top-1/5 h-4 w-4 rounded-full bg-accent shadow-lg shadow-accent/50" />
                <div className="absolute bottom-1/3 left-12 h-2 w-2 rounded-full bg-primary/60" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3 text-muted-foreground"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em]">Scroll</span>
          <div className="h-10 w-px bg-linear-to-b from-muted-foreground/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}