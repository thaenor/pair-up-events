
import React from 'react';

const EarlyAccess = () => {

  const iframeURL = 'https://sibforms.com/serve/MUIFADvijRNIEIcY8qaaiuKbDQSnhlg-D6-GifTKawJvNfWFGs9SbEWqS2IBwjtIQwmzWoSZ-g1VKRhd1gkzMqhpCTB26AlmGeGFJ5IX7h5AjTrgpBB6fYHPOJwqyg4l362UkLpk4Rqk9UHcztd6sIzcByTmy2fv0QXqN-9vNBNe32pEY7MVxHPub4i6XckZINJSVzTDX9O_dlXZ';
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
}

export default EarlyAccess;
