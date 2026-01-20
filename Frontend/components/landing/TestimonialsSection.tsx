"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { slideInLeft, slideInRight } from "./animations";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="lg:w-1/2"
          >
            <Quote className="w-14 h-14 text-primary mb-8 opacity-20" />
            <p className="font-serif text-3xl md:text-4xl leading-snug mb-10 tracking-tight">
              "SpaceBook made booking our company event incredibly simple. The
              approval was fast and the space was exactly what we needed!"
            </p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-secondary" />
              <div>
                <p className="font-semibold">Sarah Mitchell</p>
                <p className="text-primary text-xs uppercase tracking-widest font-bold mt-1">
                  Event Coordinator
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="lg:w-1/2"
          >
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-10">
              Trusted by organizations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 opacity-40">
              <div className="h-10 flex items-center justify-center font-serif text-xl font-semibold">
                CORPORATE
              </div>
              <div className="h-10 flex items-center justify-center font-serif text-xl font-semibold">
                SCHOOLS
              </div>
              <div className="h-10 flex items-center justify-center font-serif text-xl font-semibold col-span-2 md:col-span-1">
                TEAMS
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
