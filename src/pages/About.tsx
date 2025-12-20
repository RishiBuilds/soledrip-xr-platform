import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Target, Heart, Zap, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Authenticity",
    description: "Every pair we sell is 100% authentic. We work directly with brands and authorized distributors.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We're sneakerheads at heart. Our team lives and breathes footwear culture.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "From 3D product views to seamless checkout, we're always pushing boundaries.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We're building more than a store - we're building a community of style enthusiasts.",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "200+", label: "Brand Partners" },
  { value: "10K+", label: "Products" },
  { value: "15+", label: "Cities Served" },
];

export default function AboutPage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl tracking-wide md:text-5xl">
              About <span className="text-primary">SoleDrip</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Step into style. We're on a mission to bring the world's best sneakers 
              to the feet of those who dare to stand out.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <p className="font-display text-3xl text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Story */}
          <div className="mt-20 mx-auto max-w-3xl">
            <h2 className="font-display text-3xl tracking-wide">Our Story</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                SoleDrip was born in 2023 from a simple frustration: finding authentic, 
                premium sneakers in India was way too hard. Long waits, questionable authenticity, 
                and limited selection - we knew there had to be a better way.
              </p>
              <p>
                What started as a passion project between three college friends has grown into 
                India's most trusted destination for sneaker enthusiasts. We've built relationships 
                with top brands worldwide to bring you the latest drops, timeless classics, and 
                everything in between.
              </p>
              <p>
                Today, SoleDrip serves over 50,000 customers across India, but our mission remains 
                the same: to make premium footwear accessible to everyone who values quality and style.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-20">
            <h2 className="text-center font-display text-3xl tracking-wide">What We Stand For</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 rounded-3xl bg-gradient-to-r from-primary/20 to-primary/5 p-8 text-center md:p-12"
          >
            <h2 className="font-display text-2xl tracking-wide md:text-3xl">
              Ready to Step Up Your Game?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of sneaker enthusiasts who trust SoleDrip for their footwear needs.
            </p>
            <a
              href="/shop"
              className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
