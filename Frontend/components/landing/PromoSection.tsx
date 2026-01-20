"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Calendar } from "lucide-react";
import { fadeIn, stagger, slideInRight } from "./animations";

export function PromoSection() {
  return (
    <section className="py-32 bg-zinc-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="lg:w-1/2"
        >
          <motion.span
            variants={fadeIn}
            className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-6 block"
          >
            Get Started
          </motion.span>
          <motion.h2
            variants={fadeIn}
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight font-semibold tracking-tight"
          >
            Your Bookings,
            <br />
            Always Organized
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-zinc-400 text-lg mb-12 max-w-md font-light leading-relaxed"
          >
            Manage all your space reservations in one place. Track approvals,
            view schedules, and never miss a booking.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
            <Link
              href="/user/login"
              className="bg-white text-zinc-950 px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 font-semibold"
            >
              Start Booking <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admin/login"
              className="bg-zinc-800 text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 border border-zinc-700 font-semibold"
            >
              Admin Portal
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideInRight}
          className="lg:w-1/2 relative"
        >
          <div className="w-70 h-140 bg-black rounded-[3rem] border-10 border-zinc-800 p-4 mx-auto relative shadow-2xl z-10">
            <div className="bg-primary w-full h-full rounded-4xl p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-black/20 to-transparent" />
              <div className="flex justify-between items-center text-white relative">
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span className="font-bold text-[10px] tracking-widest uppercase">
                  My Bookings
                </span>
                <div className="w-5 h-5" />
              </div>
              <div className="bg-white rounded-3xl p-6 text-foreground shadow-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase">
                    Space
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase">
                    Time
                  </span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-2xl font-bold">Gym</span>
                  <span className="text-2xl font-bold">2PM</span>
                </div>
                <div className="w-full aspect-square bg-secondary flex items-center justify-center rounded-2xl border border-border">
                  <Calendar className="w-16 h-16 text-primary opacity-50" />
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-5 uppercase tracking-wider font-bold">
                  Basketball @ Main Gym
                </p>
              </div>
              <div className="h-4 w-1/2 bg-white/20 mx-auto rounded-full" />
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-primary/30 blur-[120px] rounded-full" />
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-500/20 blur-[100px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
