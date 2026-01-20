"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, ArrowRight, ChevronDown } from "lucide-react";
import { fadeIn, stagger } from "./animations";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/modern-auditorium-interior.jpg"
          alt="Stadium"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Hero Content - vertically centered */}
      <header className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-5xl w-full"
        >
          <motion.h1
            variants={fadeIn}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1] tracking-tight text-balance"
          >
            Book Your Perfect
            <br />
            <span className="font-normal opacity-90">Sports Space Today</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-white/70 mb-14 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Reserve auditoriums, gyms, and soccer fields in seconds. Simple
            requests, quick approvals, seamless booking.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={fadeIn} className="max-w-4xl mx-auto w-full">
            <div className="p-3 rounded-2xl md:rounded-full shadow-2xl bg-white/95 md:bg-white/10 md:border md:border-white/20 md:backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 items-center">
                {/* Search Input */}
                <div className="md:col-span-4 relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Space type or event"
                    className="w-full pl-12 pr-4 py-4 bg-white md:bg-transparent rounded-xl md:rounded-full outline-none text-sm text-foreground md:text-white placeholder-muted-foreground transition-colors"
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-3 relative flex items-center md:border-l border-border md:border-white/20">
                  <MapPin className="absolute left-4 md:left-5 w-5 h-5 text-muted-foreground" />
                  <select className="w-full pl-12 md:pl-13 pr-4 py-4 bg-white md:bg-transparent rounded-xl md:rounded-full outline-none text-sm text-foreground md:text-white appearance-none cursor-pointer">
                    <option className="text-foreground">All Locations</option>
                    <option className="text-foreground">Main Campus</option>
                    <option className="text-foreground">
                      Sports Complex
                    </option>
                  </select>
                </div>

                {/* Date */}
                <div className="md:col-span-3 relative flex items-center md:border-l border-border md:border-white/20">
                  <Calendar className="absolute left-4 md:left-5 w-5 h-5 text-muted-foreground" />
                  <select className="w-full pl-12 md:pl-13 pr-4 py-4 bg-white md:bg-transparent rounded-xl md:rounded-full outline-none text-sm text-foreground md:text-white appearance-none cursor-pointer">
                    <option className="text-foreground">Any Date</option>
                    <option className="text-foreground">Today</option>
                    <option className="text-foreground">This Week</option>
                    <option className="text-foreground">This Month</option>
                  </select>
                </div>

                {/* CTA Button */}
                <div className="md:col-span-2 md:pl-2">
                  <Link
                    href="/user/login"
                    className="w-full bg-primary hover:bg-green-600 text-white py-4 md:py-3.5 rounded-xl md:rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                Popular:
              </span>
              {["Soccer Fields", "Conference Room", "Basketball Court"].map(
                (tag) => (
                  <a
                    key={tag}
                    href="#spaces"
                    className="text-white/70 text-xs hover:text-primary transition-colors duration-300 underline underline-offset-4 decoration-primary/30"
                  >
                    {tag}
                  </a>
                )
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 hidden md:block"
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </motion.div>
      </header>
    </section>
  );
}
