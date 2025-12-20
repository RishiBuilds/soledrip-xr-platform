import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Last updated: December 2024</p>

          <div className="mt-12 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p className="mt-4">
                We collect information you provide directly, including:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Name, email address, and phone number when you create an account</li>
                <li>Shipping and billing addresses for order fulfillment</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Order history and preferences</li>
                <li>Communications with our customer support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="mt-4">
                We use the information we collect to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about orders, products, and services</li>
                <li>Send promotional emails (you can opt out anytime)</li>
                <li>Improve our website and customer experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
              <p className="mt-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Service providers who help us operate our business (shipping, payments)</li>
                <li>Analytics partners to help us improve our services</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
              <p className="mt-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through certified partners</li>
                <li>Regular security audits and monitoring</li>
                <li>Limited employee access to personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
              <p className="mt-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Remember your preferences and login status</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Deliver personalized content and advertisements</li>
              </ul>
              <p className="mt-2">
                You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p className="mt-4">
                You have the right to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
              <p className="mt-4">
                Our services are not directed to individuals under 18. We do not knowingly 
                collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
              <p className="mt-4">
                We may update this privacy policy from time to time. We will notify you of any 
                material changes by posting the new policy on this page and updating the 
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
              <p className="mt-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <p><strong>SoleDrip Privacy Team</strong></p>
                <p>Email: privacy@soledrip.com</p>
                <p>Address: 123 Fashion Street, Bandra West, Mumbai 400050</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
