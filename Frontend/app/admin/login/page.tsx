"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/providers/auth-provider";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const t = useTranslations();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || t("auth.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel – Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0">
          <img
            src="/soccer-field-at-sunset.jpg"
            alt="Stadium at sunset"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-8 h-8 bg-primary rounded-full" />
            <span className="text-xl font-semibold tracking-tight">
              SpaceBook Admin
            </span>
          </Link>

          <div className="max-w-md">
            <blockquote className="font-serif text-3xl leading-snug mb-6">
              “Secure access to manage facilities, bookings, and operations —
              all in one place.”
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm" />
              <div>
                <p className="font-semibold text-sm">Administration Portal</p>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
                  Restricted Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel – Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="absolute top-6 right-6 lg:top-12 lg:right-12 z-20">
          <LanguageSwitcher />
        </div>

        <div className="absolute top-6 left-6 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center lg:text-left">
            <h1 className="font-serif text-3xl lg:text-4xl font-medium tracking-tight mb-2">
              {t("auth.adminPortal")}
            </h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              {t("auth.adminDescription")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  {t("common.email")}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@spacebook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50 border-input hover:border-primary/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  {t("common.password")}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50 border-input hover:border-primary/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.signingIn")}
                </>
              ) : (
                t("common.signIn")
              )}
            </Button>
          </form>

          <div className="pt-6 text-center text-sm text-muted-foreground">
            {t("auth.demo")}:{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
              admin@spacebook.com
            </span>{" "}
            /{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
              admin123
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
