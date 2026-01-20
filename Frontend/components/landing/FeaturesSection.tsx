"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Ticket, Smartphone } from "lucide-react";
import { fadeIn } from "./animations";

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Bookings",
              body: "100% Confirmed Reservations. Every booking is verified so you can plan with confidence.",
            },
            {
              icon: Ticket,
              title: "Transparent Pricing",
              body: "No hidden fees or surprise charges. What you see is what you pay for your space.",
            },
            {
              icon: Smartphone,
              title: "Instant Confirmation",
              body: "Get booking confirmations delivered straight to your phone immediately after approval.",
            },
          ].map((prop, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <prop.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-serif text-xl mb-4 font-semibold">
                {prop.title}
              </h4>
              <p className="text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">
                {prop.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
