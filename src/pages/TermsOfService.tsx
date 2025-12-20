import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Last updated: December 2024</p>

          <div className="mt-12 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="mt-4">
                By accessing and using SoleDrip's website and services, you agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not 
                use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Account Registration</h2>
              <p className="mt-4">
                To make purchases, you may need to create an account. You agree to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Products and Pricing</h2>
              <p className="mt-4">
                All products listed on our website are subject to availability. We reserve 
                the right to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Limit quantities available for purchase</li>
                <li>Discontinue any product at any time</li>
                <li>Refuse or cancel orders at our discretion</li>
                <li>Correct pricing errors (we will notify you before processing)</li>
              </ul>
              <p className="mt-4">
                Prices are displayed in Indian Rupees (₹) and include applicable taxes unless 
                otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Orders and Payment</h2>
              <p className="mt-4">
                When you place an order:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Your order is an offer to purchase, not a binding agreement</li>
                <li>We accept your order when we send a shipping confirmation</li>
                <li>Payment is processed securely through our payment partners</li>
                <li>You must be authorized to use the payment method provided</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Shipping and Delivery</h2>
              <p className="mt-4">
                Please refer to our <a href="/shipping" className="text-primary hover:underline">Shipping Policy</a> for 
                detailed information about delivery times, costs, and procedures.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Returns and Refunds</h2>
              <p className="mt-4">
                Please refer to our <a href="/returns" className="text-primary hover:underline">Returns Policy</a> for 
                detailed information about returns, exchanges, and refunds.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Intellectual Property</h2>
              <p className="mt-4">
                All content on our website, including text, graphics, logos, images, and 
                software, is the property of SoleDrip or its licensors and is protected by 
                copyright and trademark laws. You may not:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks without written authorization</li>
                <li>Reverse engineer any software or technology on our site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. User Conduct</h2>
              <p className="mt-4">
                You agree not to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Use our services for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our website</li>
                <li>Submit false or misleading information</li>
                <li>Engage in fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
              <p className="mt-4">
                To the maximum extent permitted by law, SoleDrip shall not be liable for any 
                indirect, incidental, special, or consequential damages arising from your use 
                of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Indemnification</h2>
              <p className="mt-4">
                You agree to indemnify and hold harmless SoleDrip and its affiliates from any 
                claims, damages, or expenses arising from your violation of these terms or 
                your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Governing Law</h2>
              <p className="mt-4">
                These terms are governed by the laws of India. Any disputes shall be subject 
                to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">12. Changes to Terms</h2>
              <p className="mt-4">
                We may update these terms from time to time. Continued use of our services 
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">13. Contact</h2>
              <p className="mt-4">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <p><strong>SoleDrip Legal Team</strong></p>
                <p>Email: legal@soledrip.com</p>
                <p>Address: 123 Fashion Street, Bandra West, Mumbai 400050</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
