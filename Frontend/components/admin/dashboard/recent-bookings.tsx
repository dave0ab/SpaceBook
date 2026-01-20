"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface RecentBookingsProps {
  bookings: any[];
  translations: {
    recentBookings: string;
    viewAll: string;
    pending: string;
    noBookings: string;
  };
}

export function RecentBookings({ bookings, translations }: RecentBookingsProps) {
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 md:p-6 pb-4">
        <CardTitle className="text-base md:text-lg">
          {translations.recentBookings}
        </CardTitle>
        <Link href="/admin/bookings">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            {translations.viewAll}
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-3 md:space-y-4">
          {pendingBookings.slice(0, 5).map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 md:p-4 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base truncate">
                    {booking.space?.name || "Unknown Space"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    <span className="block sm:inline">
                      {booking.user?.name || "Unknown User"}
                    </span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">
                      {format(new Date(booking.date), "MMM d, yyyy")}
                    </span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-status-pending/20 text-status-pending flex-shrink-0 self-start sm:self-auto"
              >
                {translations.pending}
              </Badge>
            </div>
          ))}
          {pendingBookings.length === 0 && (
            <p className="text-center text-muted-foreground py-6 md:py-8 text-sm md:text-base">
              {translations.noBookings}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
