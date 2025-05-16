
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Pair Up made it so easy to break out of our usual social routine. We met an awesome couple at a cooking class and now meet up regularly!",
    author: "Sophia & Michael",
    location: "New York, NY",
    initials: "SM"
  },
  {
    quote: "As someone new to the city, this was exactly what I needed. My roommate and I connected with two other people in a low-pressure, fun setting.",
    author: "James & Alex",
    location: "Austin, TX",
    initials: "JA"
  },
  {
    quote: "The 2+2 format is genius. It's the perfect balance between comfortable and exciting, especially for introverts like us.",
    author: "Emma & David",
    location: "Portland, OR",
    initials: "ED"
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-pairup-darkBlue">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Are Saying</h2>
          <p className="text-lg text-pairup-cream/80 max-w-2xl mx-auto">
            Hear from pairs who have already experienced the magic of connecting through Pair Up
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-pairup-darkBlueAlt to-pairup-darkBlueAlt/70 p-8 rounded-2xl relative card-hover"
            >
              <div className="absolute -top-4 -left-2 text-5xl text-pairup-cyan opacity-30">"</div>
              <p className="text-pairup-cream/90 mb-6 relative z-10">{testimonial.quote}</p>
              <div className="flex items-center">
                <Avatar className="mr-4 border-2 border-pairup-cyan">
                  <AvatarFallback className="bg-pairup-darkBlue text-pairup-cyan">{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-pairup-cyan">{testimonial.author}</p>
                  <p className="text-xs text-pairup-cream/60">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
