"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Smartphone,
  Ticket,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Users,
  Dribbble,
  Trophy,
  Zap,
  Quote,
  Instagram,
  Twitter,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-out ${
        scrolled ? "bg-background/95 backdrop-blur-lg shadow-sm py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-full transition-transform duration-300 group-hover:scale-110" />
          <span
            className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            SpaceBook
          </span>
        </Link>

        <div
          className={`hidden md:flex items-center gap-12 text-sm font-medium transition-colors duration-300 ${
            scrolled ? "text-muted-foreground" : "text-white/80"
          }`}
        >
          <a
            href="#spaces"
            className="hover:text-primary transition-colors duration-300"
          >
            Spaces
          </a>
          <a
            href="#features"
            className="hover:text-primary transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="hover:text-primary transition-colors duration-300"
          >
            Reviews
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/user/login"
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              scrolled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-foreground hover:bg-primary hover:text-white"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/admin/login"
            className={`hidden sm:block px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              scrolled
                ? "border border-border text-foreground hover:bg-secondary"
                : "border border-white/30 text-white hover:bg-white hover:text-foreground"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HomeContent() {
  return (
    <div className="bg-background text-foreground antialiased">
      <Navbar />

      {/* Hero Section */}
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

      {/* Trending Spaces - consistent py-32 */}
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

      {/* Value Propositions - consistent py-32 */}
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

      {/* Browse by Category - consistent py-32 */}
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

      {/* Testimonial - consistent py-32 */}
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

      {/* App Promo - Dark CTA - consistent py-32 */}
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

      {/* Footer - consistent py-24 */}
      <footer className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-16 mb-16">
            {/* Brand */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <span className="text-lg font-semibold tracking-tight">
                  SpaceBook
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Simple, secure booking for sports facilities and event spaces.
              </p>
            </div>

            {/* Links + Newsletter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-16">
              {/* Links */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest mb-5">
                  Quick Links
                </h5>
                <ul className="space-y-4 text-sm text-muted-foreground font-light">
                  <li>
                    <Link
                      href="/user/login"
                      className="hover:text-foreground transition-colors duration-300"
                    >
                      Book a Space
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/login"
                      className="hover:text-foreground transition-colors duration-300"
                    >
                      Admin Portal
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors duration-300"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest mb-5">
                  Stay Updated
                </h5>
                <form className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 bg-secondary px-5 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                  <button className="bg-foreground text-background px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary transition-all duration-300">
                    Join
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border text-xs text-muted-foreground">
            <p className="uppercase tracking-widest font-medium">
              2024 SpaceBook
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-primary transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
