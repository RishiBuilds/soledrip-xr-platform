import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  shop: [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Sports", href: "/sports" },
    { name: "Sneakers", href: "/sneakers" },
    { name: "New Arrivals", href: "/new" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-linear-to-b from-background to-muted/30">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl tracking-wider">
                SOLE<span className="text-primary">DRIP</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Step into style. Premium sneakers and footwear for those who dare to stand out.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold">Subscribe to our newsletter</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Get exclusive deals and be the first to know about new drops.
              </p>
              <form className="mt-4 flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-xs"
                />
                <Button type="submit">
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg tracking-wide">SHOP</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wide">SUPPORT</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wide">COMPANY</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 lg:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SoleDrip. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
