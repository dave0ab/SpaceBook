"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fadeIn, stagger } from "./animations";

export function SpacesSection() {
  return (
    <section id="spaces" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16"
        >
          <motion.div variants={fadeIn}>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 font-semibold tracking-tight">
              Available Spaces
            </h2>
            <div className="h-1 w-16 bg-primary rounded-full" />
          </motion.div>
          <motion.div variants={fadeIn}>
            <Link
              href="/user/login"
              className="text-sm font-semibold flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Main Auditorium",
              desc: "500-seat venue perfect for conferences and presentations",
              tag: "Available",
              price: "$150/hr",
              image: "/modern-auditorium-interior.jpg",
            },
            {
              title: "Multipurpose Gym",
              desc: "Versatile space for basketball, volleyball, and indoor sports",
              tag: "Popular",
              price: "$80/hr",
              image: "/indoor-gymnasium-sports-facility.jpg",
            },
            {
              title: "Soccer Field A",
              desc: "Professional-grade natural turf field with full markings",
              tag: "High Demand",
              price: "$120/hr",
              image: "/soccer-training-field.jpg",
            },
          ].map((space, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              className="group cursor-pointer"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl mb-5 shadow-lg">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-5 right-5 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  {space.tag}
                </span>
              </div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                Hourly Booking
              </p>
              <h3 className="font-serif text-2xl mb-2 font-semibold tracking-tight">
                {space.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {space.desc}
              </p>
              <p className="font-semibold text-base">
                Starting at {space.price}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
