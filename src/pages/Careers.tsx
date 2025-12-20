import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Heart, Zap, Coffee, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const openPositions = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Mumbai / Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Mumbai",
    type: "Full-time",
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Delhi NCR",
    type: "Full-time",
  },
  {
    title: "Customer Experience Lead",
    department: "Operations",
    location: "Bangalore",
    type: "Full-time",
  },
  {
    title: "Content Creator",
    department: "Marketing",
    location: "Remote",
    type: "Contract",
  },
];

const perks = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive coverage for you and family" },
  { icon: Zap, title: "Learning Budget", description: "₹50,000/year for courses and conferences" },
  { icon: Coffee, title: "Free Sneakers", description: "Employee discount + quarterly drops" },
  { icon: Users, title: "Team Events", description: "Quarterly offsites and team activities" },
];

export default function CareersPage() {
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
              Join the <span className="text-primary">SoleDrip</span> Team
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Help us revolutionize how India shops for sneakers. We're looking for 
              passionate people who love what they do.
            </p>
          </div>

          {/* Culture */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-2xl tracking-wide">Our Culture</h2>
              <p className="mt-4 text-muted-foreground">
                We're a team of sneakerheads, tech enthusiasts, and creative minds united by a 
                shared passion for footwear and exceptional customer experiences. We move fast, 
                celebrate wins, learn from failures, and always keep our customers at the center.
              </p>
            </div>
          </div>

          {/* Perks */}
          <div className="mt-16">
            <h2 className="text-center font-display text-2xl tracking-wide">Why SoleDrip?</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((perk, index) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <perk.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{perk.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{perk.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="mt-20">
            <h2 className="font-display text-2xl tracking-wide">Open Positions</h2>
            <p className="mt-2 text-muted-foreground">
              Don't see a role that fits? Send us your resume at{" "}
              <a href="mailto:careers@soledrip.com" className="text-primary hover:underline">
                careers@soledrip.com
              </a>
            </p>

            <div className="mt-8 space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold">{position.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {position.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <Button>Apply Now</Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground">
              Questions about careers at SoleDrip?
            </p>
            <a href="/contact" className="mt-2 inline-block text-primary hover:underline">
              Get in touch with our HR team →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
