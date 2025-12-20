import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(email);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setIsEmailSent(true);
      toast({
        title: "Email sent!",
        description: "Check your inbox for the password reset link.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="relative min-h-[85vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-primary blur-[150px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
            className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent blur-[120px]"
          />
        </div>

        <div className="container-custom relative flex min-h-[85vh] items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="glass-card rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
              {isEmailSent ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                  >
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h1 className="font-display text-3xl tracking-tight">CHECK YOUR EMAIL</h1>
                  <p className="mt-4 text-muted-foreground">
                    We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                  <Button
                    onClick={() => setIsEmailSent(false)}
                    variant="outline"
                    className="mt-8 w-full h-12 rounded-xl"
                  >
                    Send again
                  </Button>
                  <Link
                    to="/auth"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <h1 className="font-display text-4xl tracking-tight">FORGOT PASSWORD</h1>
                    <p className="mt-3 text-muted-foreground">
                      Enter your email and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          className="pl-11 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                        />
                      </div>
                      {error && (
                        <p className="mt-2 text-sm text-destructive">{error}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 text-center">
                    <Link
                      to="/auth"
                      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
