import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Download, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const pressReleases = [
  {
    date: "December 2024",
    title: "SoleDrip Launches Revolutionary 3D Product Viewing",
    excerpt: "New feature allows customers to view sneakers in 360° before purchasing.",
  },
  {
    date: "November 2024",
    title: "SoleDrip Expands to 15 New Cities",
    excerpt: "Same-day delivery now available in major metros across India.",
  },
  {
    date: "October 2024",
    title: "Partnership with Nike for Exclusive Drops",
    excerpt: "SoleDrip becomes authorized retailer for limited edition releases.",
  },
  {
    date: "September 2024",
    title: "SoleDrip Raises Series A Funding",
    excerpt: "₹50 Crore raised to fuel expansion and technology investments.",
  },
];

const mediaFeatures = [
  { outlet: "Economic Times", topic: "Top 10 E-commerce Startups to Watch" },
  { outlet: "YourStory", topic: "How SoleDrip is Changing Sneaker Culture in India" },
  { outlet: "Inc42", topic: "The Rise of Niche E-commerce Platforms" },
  { outlet: "Mint", topic: "Gen-Z's New Shopping Destination" },
];

export default function PressPage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Press & <span className="text-primary">Media</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Latest news, press releases, and media resources from SoleDrip.
          </p>

          {/* Press Contact */}
          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Media Inquiries</h3>
              <p className="text-muted-foreground">
                For press inquiries, interviews, and media requests
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:press@soledrip.com">
                <Mail className="mr-2 h-4 w-4" />
                press@soledrip.com
              </a>
            </Button>
          </div>

          {/* Press Releases */}
          <div className="mt-16">
            <h2 className="font-display text-2xl tracking-wide">Press Releases</h2>
            <div className="mt-6 space-y-4">
              {pressReleases.map((release, index) => (
                <motion.div
                  key={release.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <p className="text-sm text-primary">{release.date}</p>
                  <h3 className="mt-2 font-semibold group-hover:text-primary transition-colors">
                    {release.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{release.excerpt}</p>
                  <span className="mt-3 inline-flex items-center text-sm text-primary">
                    Read More <ExternalLink className="ml-1 h-3 w-3" />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Media Coverage */}
          <div className="mt-16">
            <h2 className="font-display text-2xl tracking-wide">In the News</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {mediaFeatures.map((feature, index) => (
                <motion.div
                  key={feature.outlet}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-semibold text-primary">{feature.outlet}</p>
                  <p className="mt-1 text-sm text-muted-foreground">"{feature.topic}"</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Brand Assets */}
          <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="font-display text-2xl tracking-wide">Brand Assets</h2>
            <p className="mt-2 text-muted-foreground">
              Download our official logos, brand guidelines, and media kit.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Logo Pack
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Brand Guidelines
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Media Kit
              </Button>
            </div>
          </div>

          {/* Company Facts */}
          <div className="mt-16">
            <h2 className="font-display text-2xl tracking-wide">Company Facts</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="font-semibold">2023, Mumbai</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="font-semibold">50+ Employees</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Customers Served</p>
                <p className="font-semibold">50,000+</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Brand Partners</p>
                <p className="font-semibold">200+ Global Brands</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
