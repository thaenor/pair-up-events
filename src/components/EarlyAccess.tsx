
import React from 'react';

const EarlyAccess = () => {
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
          
          <div className="flex justify-center">
            <iframe 
              width="540" 
              height="500" 
              src="https://sibforms.com/serve/MUIFAFo86o8m1dUA5h9fubiMgBylsd3hXZ2V84DZFBHKfOv1CQTVCyTPeSuGxCQLsmCH1h_7DtFdP-ojcaR5ysflP67noxbtzCkKcL7Ku58USyCwgObIqgPOUhWEtR4CMz60dcDGWN3lTjp-MHIxVowiTLctkITSFAJp9penlJ8KxHvzdBtSa1j5R_sF_ge6aYwVbxJXDK1dgAbD" 
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
}

export default EarlyAccess;
