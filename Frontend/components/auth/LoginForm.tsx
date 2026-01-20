"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/providers/auth-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Building2, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";

export function LoginForm() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const t = useTranslations();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      // Navigation is handled in auth provider
    } catch (err: any) {
      setError(err.message || t("auth.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
      <div className="absolute top-6 right-6 lg:top-12 lg:right-12 flex items-center gap-4 z-20">
        <div className="flex lg:hidden items-center gap-2 mr-auto" />
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
          <h1 className="font-serif text-3xl lg:text-4xl font-medium tracking-tight mb-2 text-foreground">
            {t("auth.welcome")}
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            {t("auth.signInToBook")}
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
                htmlFor="login-email"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                {t("common.email")}
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-input hover:border-primary/50 focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="login-password"
                  className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  {t("common.password")}
                </Label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-input hover:border-primary/50 focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
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

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 rounded-xl gap-2 hover:bg-secondary/50 transition-colors"
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45Z"
                  fill="currentColor"
                  fillOpacity="0"
                  stroke="currentColor"
                />
                <path
                  d="M20.108 13.886c.159-1.222.159-2.55 0-3.772H12v3.772h4.633c-.09 1.157-.746 3.033-2.653 4.412l3.43 2.658c2.936-2.698 3.7-6.937 2.7-7.07Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.429 14.54a7.996 7.996 0 0 1 0-5.08l3.666 2.054a4.43 4.43 0 0 0 0 .972L5.43 14.54Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.922c1.947-.042 3.655.845 4.876 1.998l2.91-2.909C17.653 2.923 15.027 1.488 12 1.5c-4.113 0-7.669 2.366-9.39 5.86l3.856 2.992c.94-2.82 3.597-4.475 5.534-4.43Z"
                  fill="#EA4335"
                />
                <path
                  d="M12 22.5c2.915 0 5.46-1.378 7.152-3.486l-3.418-2.66c-.958.647-2.222 1.152-3.734 1.152-2.095 0-3.874-1.415-4.512-3.32l-3.86 2.993C5.645 20.89 8.652 22.5 12 22.5Z"
                  fill="#34A853"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl gap-2 hover:bg-secondary/50 transition-colors"
            >
              <Building2 className="w-5 h-5 text-foreground" />
              SSO
            </Button>
          </div>
        </div>

        <div className="pt-6 text-center text-sm text-muted-foreground">
          {t("auth.demo")}:{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
            john.smith@example.com
          </span>{" "}
          /{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
            password123
          </span>
        </div>
      </motion.div>
    </div>
  );
}
