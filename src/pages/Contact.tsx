import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Message sent! We'll get back to you soon.");
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <Layout>
            <div className="container-custom py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-4xl"
                >
                    <h1 className="font-display text-4xl tracking-wide md:text-5xl">
                        Contact <span className="text-primary">Us</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Have a question or feedback? We'd love to hear from you.
                    </p>

                    <div className="mt-12 grid gap-12 lg:grid-cols-2">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="mt-1 text-muted-foreground">support@soledrip.com</p>
                                    <p className="text-muted-foreground">sales@soledrip.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="mt-1 text-muted-foreground">+91 1800-123-4567</p>
                                    <p className="text-sm text-muted-foreground">Mon-Sat, 9am-6pm IST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Address</h3>
                                    <p className="mt-1 text-muted-foreground">
                                        SoleDrip Headquarters<br />
                                        123 Fashion Street, Bandra West<br />
                                        Mumbai, Maharashtra 400050
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-6 rounded-2xl border border-border bg-card p-6"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <Input placeholder="Your name" required className="mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="your@email.com" required className="mt-1" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Subject</label>
                                <Input placeholder="How can we help?" required className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                    placeholder="Tell us more..."
                                    required
                                    rows={5}
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                <Send className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </motion.form>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
