"use client";

import { useTranslations } from "@/lib/i18n";

interface StatusBreakdownChartProps {
  statusBreakdown: {
    approved: number;
    pending: number;
    rejected: number;
  };
  totalBookings: number;
}

export function StatusBreakdownChart({ statusBreakdown, totalBookings }: StatusBreakdownChartProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 md:gap-8">
      {/* Pie Chart Representation */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="transform -rotate-90 w-full h-full"
        >
          {/* Approved */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--status-approved)"
            strokeWidth="20"
            strokeDasharray={`${totalBookings > 0 ? (statusBreakdown.approved / totalBookings) * 251.2 : 0} 251.2`}
          />
          {/* Pending */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--status-pending)"
            strokeWidth="20"
            strokeDasharray={`${totalBookings > 0 ? (statusBreakdown.pending / totalBookings) * 251.2 : 0} 251.2`}
            strokeDashoffset={`-${totalBookings > 0 ? (statusBreakdown.approved / totalBookings) * 251.2 : 0}`}
          />
          {/* Rejected */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--status-rejected)"
            strokeWidth="20"
            strokeDasharray={`${totalBookings > 0 ? (statusBreakdown.rejected / totalBookings) * 251.2 : 0} 251.2`}
            strokeDashoffset={`-${totalBookings > 0 ? ((statusBreakdown.approved + statusBreakdown.pending) / totalBookings) * 251.2 : 0}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold">
              {totalBookings}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-secondary rounded-lg p-3 md:p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-status-approved" />
            <span className="text-xs md:text-sm font-medium">
              {t("booking.approved")}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-status-approved">
            {statusBreakdown.approved}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">
            {totalBookings > 0
              ? Math.round(
                  (statusBreakdown.approved / totalBookings) * 100,
                )
              : 0}
            %
          </div>
        </div>
        <div className="bg-secondary rounded-lg p-3 md:p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-status-pending" />
            <span className="text-xs md:text-sm font-medium">
              {t("booking.pending")}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-status-pending">
            {statusBreakdown.pending}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">
            {totalBookings > 0
              ? Math.round(
                  (statusBreakdown.pending / totalBookings) * 100,
                )
              : 0}
            %
          </div>
        </div>
        <div className="bg-secondary rounded-lg p-3 md:p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-status-rejected" />
            <span className="text-xs md:text-sm font-medium">
              {t("booking.rejected")}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-status-rejected">
            {statusBreakdown.rejected}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">
            {totalBookings > 0
              ? Math.round(
                  (statusBreakdown.rejected / totalBookings) * 100,
                )
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
}
