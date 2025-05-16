
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const EarlyAccess = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thanks for joining!",
        description: "We'll notify you when Pair Up launches.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="early-access" className="section-padding bg-pairup-darkBlueAlt">
      <div className="container-custom max-w-4xl">
        <div className="bg-gradient-to-br from-pairup-darkBlue to-pairup-darkBlue/80 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Early Access</h2>
            <p className="text-lg text-pairup-cream/80 max-w-2xl mx-auto">
              Be the first to know when we launch. Sign up for exclusive updates and early access.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-pairup-darkBlue border-pairup-cyan/30 placeholder:text-pairup-cream/50 text-pairup-cream"
              />
              <Button 
                type="submit" 
                className="btn-primary whitespace-nowrap" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Get Early Access"}
              </Button>
            </div>
            <p className="text-xs text-center mt-4 text-pairup-cream/60">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EarlyAccess;
