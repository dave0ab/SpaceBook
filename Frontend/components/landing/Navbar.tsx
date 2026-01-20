"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
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
