import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function UserLoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
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
              SpaceBook
            </span>
          </Link>

          <div className="max-w-md">
            <blockquote className="font-serif text-3xl leading-snug mb-6">
              "The most seamless booking experience we've ever had. SpaceBook
              transformed how we manage our sports facilities."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm" />
              <div>
                <p className="font-semibold text-sm">Alex Morgan</p>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
                  Director of Athletics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <LoginForm />
    </div>
  );
}
