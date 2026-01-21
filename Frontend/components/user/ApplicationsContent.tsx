"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/providers/auth-provider";
import { useBookings } from "@/lib/hooks/use-bookings";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { BookingStatus } from "@/lib/types";
import { format } from "date-fns";
import { Clock, CheckCircle, XCircle, Calendar, Building2 } from "lucide-react";
import { useTranslations } from '@/lib/i18n';
import { motion } from "framer-motion";
import { User, Booking } from "@/lib/types";

interface ApplicationsContentProps {
  initialUser?: User | null;
  initialBookings?: Booking[];
}

export function ApplicationsContent({ initialUser, initialBookings = [] }: ApplicationsContentProps = {}) {
  const { user: authUser } = useAuth();
  const user = authUser || initialUser;
  
  const { data: bookings = [], isLoading } = useBookings(undefined, user?.id);
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  const t = useTranslations();

  const userBookings = bookings.length > 0 ? bookings : initialBookings;

  const filteredBookings = activeTab === "all" ? userBookings : userBookings.filter((b) => b.status === activeTab);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 px-3 py-1 rounded-full font-medium">
            <Clock className="h-3.5 w-3.5" />
            {t('booking.pending')}
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 px-3 py-1 rounded-full font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            {t('booking.approved')}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1.5 px-3 py-1 rounded-full font-medium">
            <XCircle className="h-3.5 w-3.5" />
            {t('booking.rejected')}
          </Badge>
        );
    }
  };

  const counts = {
    all: userBookings.length,
    pending: userBookings.filter((b) => b.status === "pending").length,
    approved: userBookings.filter((b) => b.status === "approved").length,
    rejected: userBookings.filter((b) => b.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-24 lg:pb-32 flex items-center justify-center">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-24 lg:pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 lg:mb-12"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            HISTORY
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 font-serif">{t('applications.myApplications')}</h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-light max-w-2xl">{t('applications.applicationHistory')}</p>
      </motion.div>

      {/* Tabs header — lighter, fewer borders, more air */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as BookingStatus | "all")}
        className="w-full space-y-6 sm:space-y-8 lg:space-y-12"
      >
        {/* Floating Segmented Control Tabs */}
        <div className="flex justify-center px-2 sm:px-4 overflow-x-auto">
          <TabsList className="inline-flex">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-[1rem] transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-[0_2px_6px_rgba(0,0,0,0.08)] min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="capitalize text-xs sm:text-sm font-medium whitespace-nowrap">
                    {t(status === 'all' ? 'filters.allStatus' : `booking.${status}`)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] opacity-50 font-mono">
                    {counts[status as keyof typeof counts] || counts.all}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="outline-none focus-visible:ring-0">
          {filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-16 sm:py-24 lg:py-32 px-4"
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                <Building2 className="relative h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/20" />
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-foreground/70 tracking-tight mb-2">
                {t('applications.noApplications')}
              </h3>
              <Button
                variant="link"
                className="mt-3 text-primary/90 hover:text-primary transition-colors text-xs sm:text-sm"
                asChild
              >
                <a href="/user/book">{t('booking.bookSpace')} →</a>
              </Button>
            </motion.div>
          ) : (
            /* World-Class Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 px-2 sm:px-4">
              {filteredBookings.map((booking, idx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: "easeOut" }}
                >
                  <Card className="group h-full border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/20 transition-all duration-300 shadow-none rounded-xl sm:rounded-2xl overflow-hidden">
                    <CardContent className="p-4 sm:p-6 lg:p-9 flex flex-col h-full">
                      {/* Header: Status & Icon */}
                      <div className="flex justify-between items-start mb-4 sm:mb-6 lg:mb-8">
                        <div
                          className={`p-3 sm:p-3.5 lg:p-4 rounded-xl sm:rounded-[1.25rem] transition-colors ${
                            booking.status === "pending"
                              ? "bg-amber-100/50 text-amber-700"
                              : booking.status === "approved"
                              ? "bg-emerald-100/50 text-emerald-700"
                              : "bg-red-100/50 text-red-700"
                          }`}
                        >
                          {getStatusIcon(booking.status)}
                        </div>
                        <div className="font-mono text-[9px] sm:text-[10px] tracking-widest font-bold opacity-30 group-hover:opacity-50 transition-opacity">
                          ID-{booking.id.slice(-6)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow space-y-4 sm:space-y-5 lg:space-y-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight text-foreground/90 group-hover:text-primary transition-colors">
                          {booking.space?.name || 'Unknown Space'}
                        </h3>

                        <div className="space-y-2.5 sm:space-y-3">
                          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground/80">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-background/80 flex items-center justify-center border border-border/40 flex-shrink-0">
                              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="font-medium tracking-tight">
                              {format(new Date(booking.date), "MMMM d, yyyy")}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground/80">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-background/80 flex items-center justify-center border border-border/40 flex-shrink-0">
                              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="font-medium tracking-tight">
                              {booking.startTime} — {booking.endTime}
                            </span>
                          </div>
                          {booking.createdAt && (
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground/80 pt-2 border-t border-border/30">
                              <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-background/80 flex items-center justify-center border border-border/40 flex-shrink-0">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </div>
                              <span className="font-medium tracking-tight">
                                {t('booking.requestCreatedAt')}: {format(new Date(booking.createdAt), "MMM d, yyyy HH:mm")}
                              </span>
                            </div>
                          )}
                        </div>

                        {booking.notes && (
                          <div className="relative pt-3 sm:pt-4">
                            <p className="text-[12px] sm:text-[13px] leading-relaxed text-muted-foreground/60 italic line-clamp-2">
                              "{booking.notes}"
                            </p>
                          </div>
                        )}
                      </div>

                    
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
