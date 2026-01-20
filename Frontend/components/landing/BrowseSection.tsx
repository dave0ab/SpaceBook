"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Dribbble, Users, Calendar, Zap } from "lucide-react";
import { fadeIn } from "./animations";

export function BrowseSection() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
            Explore Your Passion
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-10">
          {[
            { label: "Basketball", icon: Trophy },
            { label: "Soccer", icon: Dribbble },
            { label: "Volleyball", icon: Trophy },
            { label: "Conferences", icon: Users },
            { label: "Events", icon: Calendar },
            { label: "Training", icon: Zap },
          ].map((cat, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
            >
              <Link href="/user/login" className="group cursor-pointer block">
                <div className="w-20 h-20 rounded-2xl border border-border bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:border-primary group-hover:bg-white transition-all duration-300">
                  <cat.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <p className="text-sm font-medium">{cat.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
