
import React from 'react';

const EarlyAccessSection = () => {
  const iframeURL = 'https://sibforms.com/serve/MUIFAFLqsAW47gnNrDXUCqzyVXOATXu7PjahHmeb1AqYEwx7SxJMvu3yKUNMqQm9aiODyeTqHUWA7IklRCduPdiy26zsDtyuOczp56P4PpZKrU2kP8i9yHQP8l6cGp8v4xR3Gbujes1E7lAYjg4MCCSGL2EeIElUR64t6PJncqwNlP2cUiShr_0E-jx3FzqHd5rK5u3jXRXM8J_P';
  
  return (
    <section id="early-access" className="py-16 md:py-24 px-4 md:px-8 bg-pairup-darkBlueAlt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-gradient-to-br from-pairup-darkBlue to-pairup-darkBlueAlt p-12 rounded-3xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Early Access</h2>
            <p className="text-lg text-pairup-cream/80 max-w-2xl mx-auto">
              Be the first to know when we launch. Sign up now to receive exclusive updates, sneak peeks, and priority access to Pair Up Events.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <iframe 
              width="540" 
              height="500" 
              src={iframeURL} 
              frameBorder="0" 
              scrolling="auto" 
              allowFullScreen 
              style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}
              title="Brevo Subscription Form"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarlyAccessSection;
