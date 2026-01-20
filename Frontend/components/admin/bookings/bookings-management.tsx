"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAdminBookings, useUpdateBookingStatus } from "@/lib/hooks/use-admin";
import { format } from "date-fns";
import {
  Check,
  X,
  Loader2,
  Search,
  CalendarIcon,
  Filter,
  XCircle,
} from "lucide-react";
import type { BookingStatus } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

const ITEMS_PER_PAGE = 10;

interface BookingsManagementProps {
  initialBookings: any[];
  spaces: any[];
}

export function BookingsManagement({ initialBookings, spaces }: BookingsManagementProps) {
  const { data: bookings = initialBookings, isLoading } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();
  const t = useTranslations();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [spaceFilter, setSpaceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    await updateStatus.mutateAsync({ bookingId, status });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-status-pending/20 text-status-pending border-0 text-xs">
            {t("booking.pending")}
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-status-approved/20 text-status-approved border-0 text-xs">
            {t("booking.approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-status-rejected/20 text-status-rejected border-0 text-xs">
            {t("booking.rejected")}
          </Badge>
        );
    }
  };

  const formatCreatedAt = (createdAt: unknown) => {
    try {
      if (!createdAt) return "-";
      const date = new Date(createdAt as any);
      if (Number.isNaN(date.getTime())) return "-";
      return format(date, "MMM d, yyyy HH:mm");
    } catch {
      return "-";
    }
  };

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.user?.name?.toLowerCase().includes(query) ||
          booking.user?.email?.toLowerCase().includes(query) ||
          booking.space?.name?.toLowerCase().includes(query),
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (spaceFilter && spaceFilter !== "all") {
      filtered = filtered.filter((booking) => booking.spaceId === spaceFilter);
    }

    if (dateFilter) {
      const filterDate = format(dateFilter, "yyyy-MM-dd");
      filtered = filtered.filter((booking) => {
        const bookingDate = format(new Date(booking.date), "yyyy-MM-dd");
        return bookingDate === filterDate;
      });
    }

    return filtered;
  }, [bookings, searchQuery, statusFilter, spaceFilter, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSpaceFilter("all");
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || spaceFilter !== "all" || dateFilter;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="p-4 md:p-6 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <CardTitle className="text-base md:text-lg">
              {t("booking.bookingRequests")}
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {filteredBookings.length} {t("filters.bookingsFound")}
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2 w-full sm:w-auto"
            >
              <XCircle className="h-4 w-4" />
              {t("common.clearFilters")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatus")}</SelectItem>
                <SelectItem value="pending">{t("booking.pending")}</SelectItem>
                <SelectItem value="approved">{t("booking.approved")}</SelectItem>
                <SelectItem value="rejected">{t("booking.rejected")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={spaceFilter} onValueChange={setSpaceFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.space")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allSpaces")}</SelectItem>
                {spaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!dateFilter && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "MMM d, yyyy") : t("filters.pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 md:py-12">
            <Loader2 className="h-8 w-8 md:h-12 md:w-12 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Filter className="h-8 w-8 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm md:text-lg font-medium text-muted-foreground">
              {hasActiveFilters ? t("common.noResults") : t("booking.noBookings")}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-md border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.user")}</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.space")}</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.date")}</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.time")}</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.status")}</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                            {booking.user?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{booking.user?.name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground">{booking.user?.email || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-sm">{booking.space?.name || "Unknown Space"}</p>
                      </td>
                      <td className="py-4 px-4 text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</td>
                      <td className="py-4 px-4 text-sm">{booking.startTime} - {booking.endTime}</td>
                      <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-4 px-4">
                        {booking.status === "pending" && (
                          <div className="flex items-center gap-2">
                             <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 border-status-approved text-status-approved hover:bg-status-approved hover:text-background bg-transparent text-xs"
                              onClick={() => handleStatusUpdate(booking.id, "approved")}
                              disabled={updateStatus.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 border-status-rejected text-status-rejected hover:bg-status-rejected hover:text-foreground bg-transparent text-xs"
                              onClick={() => handleStatusUpdate(booking.id, "rejected")}
                              disabled={updateStatus.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} />
                    </PaginationItem>
                    {getPageNumbers().map((page, i) => (
                      <PaginationItem key={i}>
                        {page === "ellipsis" ? <PaginationEllipsis /> : (
                          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(page); }} isActive={currentPage === page}>{page}</PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
