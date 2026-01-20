"use client";

import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
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
  );
}
