"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/providers/auth-provider";
import { useBookings } from "@/lib/hooks/use-bookings";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowRight,
  Loader2,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useTranslations } from "@/lib/i18n";

import { motion } from "framer-motion";
import { User, Booking } from "@/lib/types";

interface DashboardContentProps {
  initialUser?: User | null;
  initialBookings?: Booking[];
}

export function DashboardContent({ initialUser, initialBookings = [] }: DashboardContentProps = {}) {
  const { user: authUser } = useAuth();
  const user = authUser || initialUser;
  
  const { data: bookings = [], isLoading } = useBookings(undefined, user?.id, undefined);
  // Note: We use the server-side bookings for the first render to avoid flashing
  const displayBookings = bookings.length > 0 ? bookings : initialBookings;
  
  const t = useTranslations();

  const pendingBookings = displayBookings.filter((b) => b.status === "pending");
  const approvedBookings = displayBookings.filter((b) => b.status === "approved");
  const rejectedBookings = displayBookings.filter((b) => b.status === "rejected");

  const stats = [
    {
      label: t("booking.pending"),
      value: pendingBookings.length,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-100 dark:border-amber-900/30"
    },
    {
      label: t("booking.approved"),
      value: approvedBookings.length,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-100 dark:border-emerald-900/30"
    },
    {
      label: t("booking.rejected"),
      value: rejectedBookings.length,
      icon: XCircle,
      color: "text-red-600 dark:text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-100 dark:border-red-900/30"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 gap-1.5 px-3 py-1 rounded-md font-medium">
            <Clock className="h-3.5 w-3.5" />
            {t("booking.pending")}
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 gap-1.5 px-3 py-1 rounded-md font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            {t("booking.approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50 gap-1.5 px-3 py-1 rounded-md font-medium">
            <XCircle className="h-3.5 w-3.5" />
            {t("booking.rejected")}
          </Badge>
        );
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
      {/* Welcome */}
     <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-border/40"
    >
      {/* Left: Identity & Context */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            {t("sidebar.dashboard")}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("dashboard.welcomeBack")}, <span className="text-primary/90">{user?.name?.split(' ')[0] || "User"}</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t("dashboard.hereIsOverview")}
        </p>
      </div>

      {/* Right: Focused Quick Action */}
      <div className="flex items-center gap-3">
        <Link href="/user/book">
          <Button 
            size="lg" 
            className="h-11 px-6 rounded-xl text-[13px] font-bold shadow-none bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("booking.bookSpace")}
          </Button>
        </Link>
      </div>
    </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="bg-card border border-border/60 hover:border-border transition-colors duration-300 shadow-none rounded-xl h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-lg ${stat.bgColor} border ${stat.borderColor} transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold font-serif tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

     

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-card border border-border/60 shadow-none rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-lg font-serif font-semibold">{t("booking.recentBookings")}</CardTitle>
                </div>
            </div>
            <Link href="/user/applications">
              <Button variant="ghost" size="sm" className="hover:bg-background/80 hover:text-primary rounded-md text-muted-foreground h-8 px-3 text-xs">
                {t("booking.viewAll")}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : displayBookings.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-base mb-1">{t("booking.noBookings")}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  {t("applications.startBooking")}
                </p>
                <Link href="/user/book">
                  <Button variant="outline" size="sm" className="rounded-md border-border hover:bg-muted">
                    {t("booking.bookSpace")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {displayBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1 text-foreground">
                          {booking.space?.name || "Unknown Space"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">
                                {format(
                                new Date(
                                    typeof booking.date === "string"
                                    ? booking.date
                                    : booking.date
                                ),
                                "MMM d, yyyy"
                                )}
                            </span>
                             <span className="text-border/60">•</span>
                            <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
