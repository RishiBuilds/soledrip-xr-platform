import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee. Metro cities typically receive orders faster.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within India. We're working on expanding to international markets soon. Sign up for our newsletter to be notified when we launch international shipping.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with tracking information. You can also track your order in your account under 'Order History'.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Orders can be modified or cancelled within 1 hour of placing them. After that, please contact our support team and we'll do our best to help.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for unworn items in original packaging. Items must be in the same condition as received with all tags attached.",
      },
      {
        q: "How do I return an item?",
        a: "Log into your account, go to 'Order History', select the item you want to return, and follow the prompts. We'll email you a prepaid shipping label.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes! Exchanges are free. Simply initiate a return and place a new order for the correct size. We'll prioritize shipping your new item.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "Are all products authentic?",
        a: "Absolutely. We are an authorized retailer and only sell 100% authentic products. Every item comes with original packaging and authenticity guaranteed.",
      },
      {
        q: "How do I find my size?",
        a: "Check out our detailed Size Guide page. We provide measurements for each brand as sizing can vary. When in doubt, we recommend sizing up.",
      },
      {
        q: "Do you restock sold-out items?",
        a: "Popular items are restocked regularly. Click 'Notify Me' on any sold-out product page to receive an email when it's back in stock.",
      },
    ],
  },
  {
    category: "Payment & Security",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets like Paytm and PhonePe. Cash on Delivery is available for orders under ₹10,000.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all transactions are encrypted using SSL technology. We never store your complete card details on our servers.",
      },
      {
        q: "Do you offer EMI options?",
        a: "Yes, EMI options are available on orders above ₹3,000 for select bank cards. Options will be displayed at checkout.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>

          <div className="mt-12 space-y-10">
            {faqs.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <h2 className="mb-4 font-display text-xl tracking-wide text-primary">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${sectionIndex}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 rounded-2xl bg-primary/10 p-6 text-center"
          >
            <h3 className="font-semibold">Still have questions?</h3>
            <p className="mt-2 text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-block font-medium text-primary hover:underline"
            >
              Contact Support →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
