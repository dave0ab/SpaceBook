"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { useAdminBookings, useUpdateBookingStatus } from "@/lib/hooks/use-admin"
import { useSpaces } from "@/lib/hooks/use-spaces"
import { format } from "date-fns"
import { Check, X, Loader2, Search, CalendarIcon, Filter, XCircle } from "lucide-react"
import type { BookingStatus } from "@/lib/types"
import { useState, useMemo } from "react"
import { useTranslations } from 'next-intl'

const ITEMS_PER_PAGE = 10

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useAdminBookings()
  const { data: spaces = [] } = useSpaces()
  const updateStatus = useUpdateBookingStatus()
  const t = useTranslations()

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [spaceFilter, setSpaceFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [currentPage, setCurrentPage] = useState(1)

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    await updateStatus.mutateAsync({ bookingId, status })
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-status-pending/20 text-status-pending border-0">{t('booking.pending')}</Badge>
      case "approved":
        return <Badge className="bg-status-approved/20 text-status-approved border-0">{t('booking.approved')}</Badge>
      case "rejected":
        return <Badge className="bg-status-rejected/20 text-status-rejected border-0">{t('booking.rejected')}</Badge>
    }
  }

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings]

    // Search filter (user name, email, or space name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.user?.name?.toLowerCase().includes(query) ||
        booking.user?.email?.toLowerCase().includes(query) ||
        booking.space?.name?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Space filter
    if (spaceFilter && spaceFilter !== "all") {
      filtered = filtered.filter(booking => booking.spaceId === spaceFilter)
    }

    // Date filter
    if (dateFilter) {
      const filterDate = format(dateFilter, "yyyy-MM-dd")
      filtered = filtered.filter(booking => {
        const bookingDate = format(new Date(booking.date), "yyyy-MM-dd")
        return bookingDate === filterDate
      })
    }

    return filtered
  }, [bookings, searchQuery, statusFilter, spaceFilter, dateFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredBookings, currentPage])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, spaceFilter, dateFilter])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSpaceFilter("all")
    setDateFilter(undefined)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || statusFilter !== "all" || spaceFilter !== "all" || dateFilter

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('ellipsis')
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
              <CardTitle>{t('booking.bookingRequests')}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredBookings.length} {t('filters.bookingsFound')}
                  </p>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    {t('common.clearFilters')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters Section */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('filters.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('filters.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('booking.pending')}</SelectItem>
                      <SelectItem value="approved">{t('booking.approved')}</SelectItem>
                      <SelectItem value="rejected">{t('booking.rejected')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Space Filter */}
                  <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('filters.space')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allSpaces')}</SelectItem>
                      {spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!dateFilter && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter ? format(dateFilter, "MMM d, yyyy") : t('filters.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 items-center text-sm">
                    <span className="text-muted-foreground">{t('filters.activeFilters')}:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        {t('filters.search')}: {searchQuery}
                        <XCircle 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {t('filters.status')}: {statusFilter}
                        <XCircle 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setStatusFilter("all")}
                        />
                      </Badge>
                    )}
                    {spaceFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {t('filters.space')}: {spaces.find(s => s.id === spaceFilter)?.name}
                        <XCircle 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSpaceFilter("all")}
                        />
                      </Badge>
                    )}
                    {dateFilter && (
                      <Badge variant="secondary" className="gap-1">
                        {t('filters.date')}: {format(dateFilter, "MMM d, yyyy")}
                        <XCircle 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setDateFilter(undefined)}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Bookings Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    {hasActiveFilters ? t('common.noResults') : t('booking.noBookings')}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      {t('common.clearFilters')}
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.user')}</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.space')}</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.date')}</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.time')}</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.status')}</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                        {paginatedBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                                {booking.user?.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="font-medium">{booking.user?.name || 'Unknown User'}</p>
                                <p className="text-sm text-muted-foreground">{booking.user?.email || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium">{booking.space?.name || 'Unknown Space'}</p>
                            <p className="text-sm text-muted-foreground capitalize">{booking.space?.type || 'N/A'}</p>
                          </td>
                          <td className="py-4 px-4">{format(new Date(booking.date), "MMM d, yyyy")}</td>
                          <td className="py-4 px-4">
                            {booking.startTime} - {booking.endTime}
                          </td>
                          <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                          <td className="py-4 px-4">
                            {booking.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-status-approved text-status-approved hover:bg-status-approved hover:text-background bg-transparent"
                                  onClick={() => handleStatusUpdate(booking.id, "approved")}
                                  disabled={updateStatus.isPending}
                                >
                                  <Check className="h-4 w-4" />
                                  {t('booking.approve')}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-status-rejected text-status-rejected hover:bg-status-rejected hover:text-foreground bg-transparent"
                                  onClick={() => handleStatusUpdate(booking.id, "rejected")}
                                  disabled={updateStatus.isPending}
                                >
                                  <X className="h-4 w-4" />
                                  {t('booking.reject')}
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                  {/* Pagination - Only show when there are multiple pages */}
                  {filteredBookings.length > 0 && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        {t('filters.showing')} <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> {t('filters.to')} <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)}</span> {t('filters.of')} <span className="font-medium">{filteredBookings.length}</span> {t('sidebar.bookings').toLowerCase()}
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                              {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCurrentPage(page)
                                  }}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}

                  {/* Show result count when single page with results */}
                  {filteredBookings.length > 0 && totalPages <= 1 && (
                    <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                      {t('pagination.showingAll')} <span className="font-medium">{filteredBookings.length}</span> {t('sidebar.bookings').toLowerCase()}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
