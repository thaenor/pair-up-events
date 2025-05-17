
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

// Add TypeScript declarations for window properties
declare global {
  interface Window {
    REQUIRED_CODE_ERROR_MESSAGE: string;
    LOCALE: string;
    EMAIL_INVALID_MESSAGE: string;
    REQUIRED_ERROR_MESSAGE: string;
    GENERIC_INVALID_MESSAGE: string;
  }
}

const EarlyAccess = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'error' | 'success'>('idle');

  useEffect(() => {
    // Add Brevo script to the document
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://sibforms.com/forms/end-form/build/main.js';
    document.body.appendChild(script);

    // Set up required global variables for Brevo
    window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
    window.LOCALE = 'en';
    window.EMAIL_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
    window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank.";
    window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setFormStatus('idle');
    
    try {
      // Simulate form submission to Brevo
      // In production, you would use fetch to post to the Brevo endpoint
      const endpoint = "https://sibforms.com/serve/MUIFAJBVMqfKmHCQpFZ3o6XyMGOGbjBp1ayKRbd-82iga4cxv37G-ogfP_NlxMg12ECJ88hgy9aYCt_hjzBk8bJDKWS_qX6xnxptnEYamdk0X13r5Q8Z-LdeW_jhygnicpWt8au9Tj8SKeGr4Wo-2IaEMu8nG6aVzsCUCsCpepRyNOFs-eeYTNV7wF9_Cwswg7G_-HeGz6w3FRJZ";
      
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - in production you'd handle the actual response
      setFormStatus('success');
      toast({
        title: "Thanks for joining!",
        description: "Your subscription has been successful.",
      });
      setEmail('');
    } catch (error) {
      setFormStatus('error');
      toast({
        title: "Subscription Failed",
        description: "Your subscription could not be saved. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="early-access" className="section-padding bg-pairup-darkBlueAlt">
      <div className="container-custom max-w-4xl">
        <div className="bg-gradient-to-br from-pairup-darkBlue to-pairup-darkBlue/80 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Early Access</h2>
            <p className="text-lg text-pairup-cream/80 max-w-2xl mx-auto">
              Be the first to know when we launch. Sign up now to receive exclusive updates, sneak peeks, and priority access to Pair Up Events.
            </p>
          </div>
          
          <form 
            id="sib-form" 
            onSubmit={handleSubmit} 
            className="max-w-md mx-auto"
            method="POST" 
            data-type="subscription"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="EMAIL" 
                  className="text-left block text-pairup-cream font-medium"
                >
                  Enter your email address to subscribe
                </Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full">
                    <Input
                      id="EMAIL"
                      type="email"
                      name="EMAIL"
                      placeholder="Enter your E-Mail address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-pairup-darkBlue border-pairup-cyan/30 placeholder:text-pairup-cream/50 text-pairup-cream rounded-[5px]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="btn-secondary whitespace-nowrap px-8 flex items-center gap-2" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : (
                      <>
                        <Mail size={18} />
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-left text-pairup-cream/60 mt-1">
                  Provide your email address to subscribe. For e.g abc@xyz.com
                </p>
              </div>
            </div>
            
            {formStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 text-red-200 rounded-md text-sm">
                Your subscription could not be saved. Please try again.
              </div>
            )}
            
            {formStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 text-green-200 rounded-md text-sm">
                Your subscription has been successful.
              </div>
            )}
            
            <div className="mt-6 text-xs text-center text-pairup-cream/60">
              <p>We respect your privacy. No spam, unsubscribe anytime.</p>
              <p className="mt-3">
                We use Brevo as our marketing platform. By submitting this form you agree to the processing of your data per their{' '}
                <a 
                  href="https://www.brevo.com/en/legal/privacypolicy/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="underline text-pairup-cyan hover:text-pairup-cyan/80"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>
            
            <input type="text" name="email_address_check" value="" className="hidden" />
            <input type="hidden" name="locale" value="en" />
          </form>
        </div>
      </div>
    </section>
  );
}

export default EarlyAccess;
