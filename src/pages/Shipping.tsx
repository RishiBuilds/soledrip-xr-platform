import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Package } from "lucide-react";

const shippingOptions = [
  {
    name: "Standard Shipping",
    time: "5-7 Business Days",
    price: "Free on orders over ₹2,000",
    priceBelow: "₹99 for orders under ₹2,000",
    icon: Package,
  },
  {
    name: "Express Shipping",
    time: "2-3 Business Days",
    price: "₹199",
    priceBelow: "Available for all orders",
    icon: Truck,
  },
  {
    name: "Same Day Delivery",
    time: "Within 24 Hours",
    price: "₹399",
    priceBelow: "Available in select metro cities",
    icon: Clock,
  },
];

export default function ShippingPage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Shipping <span className="text-primary">Information</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We deliver across India with multiple shipping options to suit your needs.
          </p>

          {/* Shipping Options */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{option.name}</h3>
                <p className="mt-1 text-2xl font-bold text-primary">{option.time}</p>
                <p className="mt-2 text-sm text-muted-foreground">{option.price}</p>
                <p className="text-sm text-muted-foreground">{option.priceBelow}</p>
              </motion.div>
            ))}
          </div>

          {/* Delivery Information */}
          <div className="mt-16 space-y-8">
            <section>
              <h2 className="font-display text-2xl tracking-wide">Delivery Areas</h2>
              <p className="mt-4 text-muted-foreground">
                We currently deliver to all major cities and towns across India. Pin code availability 
                is checked at checkout. Remote areas may have extended delivery times.
              </p>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted p-4">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Same Day Delivery Cities</p>
                  <p className="text-sm text-muted-foreground">
                    Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Pune, Kolkata
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl tracking-wide">Order Processing</h2>
              <p className="mt-4 text-muted-foreground">
                Orders placed before 2 PM IST on business days are typically processed the same day. 
                Orders placed after 2 PM or on weekends/holidays will be processed the next business day.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl tracking-wide">Tracking Your Order</h2>
              <p className="mt-4 text-muted-foreground">
                Once your order ships, you'll receive an email and SMS with tracking information. 
                You can also track your order anytime by logging into your account and visiting the 
                Order History section.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl tracking-wide">Delivery Attempts</h2>
              <p className="mt-4 text-muted-foreground">
                Our delivery partners will make up to 3 delivery attempts. If delivery is unsuccessful 
                after 3 attempts, the package will be returned to our warehouse and a refund will be initiated.
              </p>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h2 className="font-display text-2xl tracking-wide">Need Help?</h2>
              <p className="mt-2 text-muted-foreground">
                For shipping-related queries, reach out to our support team at{" "}
                <a href="mailto:shipping@soledrip.com" className="text-primary hover:underline">
                  shipping@soledrip.com
                </a>{" "}
                or call us at <span className="text-primary">+91 1800-123-4567</span>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
