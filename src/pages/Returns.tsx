import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";

const returnSteps = [
  {
    step: "1",
    title: "Initiate Return",
    description: "Log into your account, go to Order History, and select 'Return Item' for the product you wish to return.",
  },
  {
    step: "2",
    title: "Pack Your Item",
    description: "Place the item in its original packaging with all tags attached. Include the return slip if provided.",
  },
  {
    step: "3",
    title: "Schedule Pickup",
    description: "Choose a convenient pickup date. Our courier partner will collect the package from your address.",
  },
  {
    step: "4",
    title: "Receive Refund",
    description: "Once we receive and inspect your return, your refund will be processed within 5-7 business days.",
  },
];

export default function ReturnsPage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Returns & <span className="text-primary">Exchanges</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Not completely satisfied? No worries. We offer hassle-free returns and exchanges.
          </p>

          {/* Policy Highlights */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border">
              <RotateCcw className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">30-Day Returns</p>
                <p className="text-sm text-muted-foreground">Easy returns policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-semibold">Free Returns</p>
                <p className="text-sm text-muted-foreground">No return shipping cost</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Quick Refunds</p>
                <p className="text-sm text-muted-foreground">5-7 business days</p>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="mt-16">
            <h2 className="font-display text-2xl tracking-wide">How to Return</h2>
            <div className="mt-8 space-y-6">
              {returnSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Eligible / Not Eligible */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="font-display text-lg tracking-wide">Eligible for Return</h3>
              </div>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>• Unworn items in original condition</li>
                <li>• Items with original tags attached</li>
                <li>• Items in original packaging</li>
                <li>• Items returned within 30 days of delivery</li>
                <li>• Items purchased at full price or on sale</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-500" />
                <h3 className="font-display text-lg tracking-wide">Not Eligible</h3>
              </div>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>• Worn or used items</li>
                <li>• Items without original tags</li>
                <li>• Items damaged by customer</li>
                <li>• Items marked as "Final Sale"</li>
                <li>• Customized or personalized items</li>
              </ul>
            </div>
          </div>

          {/* Exchanges */}
          <div className="mt-16">
            <h2 className="font-display text-2xl tracking-wide">Exchanges</h2>
            <p className="mt-4 text-muted-foreground">
              Need a different size or color? We've got you covered. Exchanges are always free!
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>• Initiate an exchange through your Order History</li>
              <li>• Select your preferred size/color</li>
              <li>• We'll ship your new item as soon as we receive your return</li>
              <li>• If there's a price difference, we'll adjust accordingly</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-semibold">Need assistance with your return?</h3>
            <p className="mt-2 text-muted-foreground">
              Contact us at{" "}
              <a href="mailto:returns@soledrip.com" className="text-primary hover:underline">
                returns@soledrip.com
              </a>{" "}
              or call <span className="text-primary">+91 1800-123-4567</span>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
