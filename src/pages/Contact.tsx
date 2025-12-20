import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Message sent! We'll get back to you soon.", {
            description: "Our team typically responds within 24 hours.",
        });
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Layout>
            {/* Hero Section - Compact */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
                <div className="container-custom relative py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                            <Sparkles className="h-3 w-3" />
                            We're here to help
                        </motion.div>
                        <h1 className="font-display text-3xl tracking-wide md:text-4xl">
                            Get in <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Touch</span>
                        </h1>
                        <p className="mt-3 text-sm text-muted-foreground md:text-base">
                            Have questions? Need help with an order? Our team is ready to assist you.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-5xl"
                >
                    <div className="grid gap-6 lg:grid-cols-5">
                        {/* Contact Info - Compact */}
                        <motion.div variants={itemVariants} className="space-y-4 lg:col-span-2">
                            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-5 backdrop-blur-sm">
                                <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
                                
                                <div className="space-y-3">
                                    <motion.div
                                        whileHover={{ x: 3 }}
                                        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-primary/5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-md shadow-primary/20">
                                            <Mail className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">Email Us</h3>
                                            <a href="mailto:support@soledrip.com" className="mt-0.5 block text-xs text-muted-foreground transition-colors hover:text-primary">
                                                support@soledrip.com
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 3 }}
                                        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-primary/5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-md shadow-green-500/20">
                                            <Phone className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">Call Us</h3>
                                            <a href="tel:+911800123456" className="mt-0.5 block text-xs text-muted-foreground transition-colors hover:text-primary">
                                                +91 1800-123-4567
                                            </a>
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                Mon-Sat, 9am-6pm
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 3 }}
                                        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-primary/5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md shadow-orange-500/20">
                                            <MapPin className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">Visit Us</h3>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                123 Fashion Street<br />
                                                Mumbai, MH 400050
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Quick Response Badge - Compact */}
                            <motion.div
                                variants={itemVariants}
                                className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-6 w-6 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-semibold">Quick Response</h3>
                                        <p className="text-xs text-muted-foreground">Reply within 24 hours</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Contact Form - Compact */}
                        <motion.div variants={itemVariants} className="lg:col-span-3">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 shadow-lg backdrop-blur-sm"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">Send us a Message</h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Fill out the form and we'll get back to you soon.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <motion.div
                                        animate={{
                                            scale: focusedField === "name" ? 1.01 : 1,
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <label className="text-xs font-medium">Full Name</label>
                                        <Input
                                            placeholder="John Doe"
                                            required
                                            className="mt-1.5 h-9"
                                            onFocus={() => setFocusedField("name")}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            scale: focusedField === "email" ? 1.01 : 1,
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <label className="text-xs font-medium">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            className="mt-1.5 h-9"
                                            onFocus={() => setFocusedField("email")}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    animate={{
                                        scale: focusedField === "subject" ? 1.01 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <label className="text-xs font-medium">Subject</label>
                                    <Input
                                        placeholder="How can we help you?"
                                        required
                                        className="mt-1.5 h-9"
                                        onFocus={() => setFocusedField("subject")}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </motion.div>

                                <motion.div
                                    animate={{
                                        scale: focusedField === "message" ? 1.01 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <label className="text-xs font-medium">Message</label>
                                    <Textarea
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                        rows={4}
                                        className="mt-1.5 resize-none"
                                        onFocus={() => setFocusedField("message")}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </motion.div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="mr-2"
                                            >
                                                <Send className="h-5 w-5" />
                                            </motion.div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
