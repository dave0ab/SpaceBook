'use client';

"use client"

import { Suspense, useState } from "react"
import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useAuth } from "@/lib/providers/auth-provider"
import { useSpaces } from "@/lib/hooks/use-spaces"
import { useBookings, useCreateBooking } from "@/lib/hooks/use-bookings"
import { type SpaceType } from "@/lib/types"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon, Clock, Users, Search, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTranslations } from '@/lib/i18n'

// Time slots constant
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
]

function BookingContent() {
  const { user } = useAuth()
  const t = useTranslations()
  
  // State declarations first
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeStart, setSelectedTimeStart] = useState("")
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("")
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType | "all">("all")
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  
  // Hooks that use state - declared after state
  const { data: spaces = [], isLoading: spacesLoading } = useSpaces(selectedSpaceType === "all" ? undefined : selectedSpaceType)
  const { data: bookings = [] } = useBookings()
  const createBooking = useCreateBooking()

  // Filter spaces based on search criteria (already filtered by backend if type is selected)
  const filteredSpaces = selectedSpaceType === "all" 
    ? spaces 
    : spaces.filter((space) => space.type === selectedSpaceType)

  // Check availability
  const getSpaceAvailability = (spaceId: string) => {
    if (!selectedDate || !selectedTimeStart || !selectedTimeEnd) return "available"

    // Compare dates as strings (backend returns date as string in YYYY-MM-DD format)
    const conflictingBooking = bookings.find(
      (b) => {
        const bookingDate = typeof b.date === 'string' ? b.date : new Date(b.date).toISOString().split('T')[0];
        return (
          b.spaceId === spaceId &&
          bookingDate === selectedDate &&
          b.status !== "rejected" &&
          ((b.startTime <= selectedTimeStart && b.endTime > selectedTimeStart) ||
            (b.startTime < selectedTimeEnd && b.endTime >= selectedTimeEnd) ||
            (b.startTime >= selectedTimeStart && b.endTime <= selectedTimeEnd))
        );
      }
    )

    if (conflictingBooking) {
      return conflictingBooking.status === "pending" ? "pending" : "booked"
    }
    return "available"
  }

  const handleSubmitBooking = async () => {
    if (!selectedSpace || !selectedDate || !selectedTimeStart || !selectedTimeEnd || !user) return

    try {
      await createBooking.mutateAsync({
        spaceId: selectedSpace,
        date: selectedDate,
        startTime: selectedTimeStart,
        endTime: selectedTimeEnd,
        notes: notes || undefined,
      })

      setBookingSubmitted(true)
      setTimeout(() => {
        setBookingSubmitted(false)
        setSelectedSpace(null)
        setSelectedDate("")
        setSelectedTimeStart("")
        setSelectedTimeEnd("")
        setNotes("")
      }, 3000)
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to create booking:", error)
    }
  }

  const selectedSpaceData = selectedSpace ? spaces.find((s) => s.id === selectedSpace) : null

  const isFormComplete = selectedSpaceData && selectedDate && selectedTimeStart && selectedTimeEnd

  return (
    <main className="container mx-auto px-4 md:px-6 py-4 md:py-8 pb-24 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('booking.bookSpace')}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{t('booking.selectSpaceFirst')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Search & Filter */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Form */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 md:p-6 pb-4">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
                {t('common.search')} {t('spaces.spaces')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">{t('booking.date')}</Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-secondary border-border",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(parse(selectedDate, "yyyy-MM-dd", new Date()), "PPP") : t('filters.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate ? parse(selectedDate, "yyyy-MM-dd", new Date()) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(format(date, "yyyy-MM-dd"))
                            setDatePickerOpen(false)
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">{t('booking.startTime')}</Label>
                  <Select value={selectedTimeStart} onValueChange={setSelectedTimeStart}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder={t('booking.selectTime')} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">{t('booking.endTime')}</Label>
                  <Select value={selectedTimeEnd} onValueChange={setSelectedTimeEnd}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder={t('booking.selectTime')} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots
                        .filter((time) => time > selectedTimeStart)
                        .map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">{t('spaces.type')}</Label>
                  <Select value={selectedSpaceType} onValueChange={(v) => setSelectedSpaceType(v as SpaceType | "all")}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder={t('filters.allSpaces')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allSpaces')}</SelectItem>
                      <SelectItem value="auditorium">{t('spaces.auditorium')}</SelectItem>
                      <SelectItem value="gym">{t('spaces.gym')}</SelectItem>
                      <SelectItem value="soccer">{t('spaces.soccer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Spaces */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">{t('spaces.allSpaces')}</h2>
            {spacesLoading ? (
              <div className="flex items-center justify-center py-8 md:py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-center py-8 md:py-12 text-muted-foreground text-sm md:text-base">
                <p>{t('common.noResults')}</p>
              </div>
            ) : (
              <>
                {/* Mobile: Compact Single Column Cards */}
                <div className="md:hidden space-y-3">
                  {filteredSpaces.map((space) => {
                    const availability = getSpaceAvailability(space.id)
                    const isSelected = selectedSpace === space.id
                    return (
                      <Card
                        key={space.id}
                        className={cn(
                          "bg-card border-border cursor-pointer transition-all",
                          isSelected && "ring-2 ring-primary border-primary",
                          availability === "booked" && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => {
                          if (availability !== "booked") {
                            setSelectedSpace(isSelected ? null : space.id)
                          }
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={space.image || "/placeholder.svg"}
                                alt={space.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-sm truncate">{space.name}</h3>
                                <div className="flex-shrink-0">
                                  {availability === "available" && (
                                    <Badge className="bg-status-approved/90 text-background border-0 text-xs">{t('booking.approved')}</Badge>
                                  )}
                                  {availability === "pending" && (
                                    <Badge className="bg-status-pending/90 text-background border-0 text-xs">{t('booking.pending')}</Badge>
                                  )}
                                  {availability === "booked" && (
                                    <Badge className="bg-status-rejected/90 text-foreground border-0 text-xs">{t('booking.rejected')}</Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{space.description}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{space.capacity}</span>
                                </div>
                                <Badge variant="secondary" className="capitalize text-xs">
                                  {space.type === 'auditorium' ? t('spaces.auditorium') : 
                                   space.type === 'gym' ? t('spaces.gym') : 
                                   t('spaces.soccer')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid sm:grid-cols-2 gap-4">
                  {filteredSpaces.map((space) => {
                    const availability = getSpaceAvailability(space.id)
                    const isSelected = selectedSpace === space.id
                    return (
                      <Card
                        key={space.id}
                        className={cn(
                          "bg-card border-border cursor-pointer transition-all hover:border-primary/50",
                          isSelected && "ring-2 ring-primary border-primary",
                          availability === "booked" && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => {
                          if (availability !== "booked") {
                            setSelectedSpace(isSelected ? null : space.id)
                          }
                        }}
                      >
                        <div className="relative h-32 md:h-40">
                          <Image
                            src={space.image || "/placeholder.svg"}
                            alt={space.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            {availability === "available" && (
                              <Badge className="bg-status-approved/90 text-background border-0">{t('booking.approved')}</Badge>
                            )}
                            {availability === "pending" && (
                              <Badge className="bg-status-pending/90 text-background border-0">{t('booking.pending')}</Badge>
                            )}
                            {availability === "booked" && (
                              <Badge className="bg-status-rejected/90 text-foreground border-0">{t('booking.rejected')}</Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3 md:p-4">
                          <h3 className="font-semibold mb-1 text-sm md:text-base">{space.name}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{space.description}</p>
                          <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{space.capacity}</span>
                            </div>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {space.type === 'auditorium' ? t('spaces.auditorium') : 
                               space.type === 'gym' ? t('spaces.gym') : 
                               t('spaces.soccer')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Booking Summary - Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="bg-card border-border sticky top-24">
            <CardHeader className="p-4 md:p-6 pb-4">
              <CardTitle className="text-base md:text-lg">{t('booking.bookingDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {bookingSubmitted ? (
                <div className="text-center py-6 md:py-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-status-approved/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-status-approved" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">{t('booking.bookingCreated')}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{t('booking.pending')}</p>
                </div>
              ) : isFormComplete ? (
                <div className="space-y-4 md:space-y-6">
                  <div className="relative h-24 md:h-32 rounded-lg overflow-hidden">
                    <Image
                      src={selectedSpaceData.image || "/placeholder.svg"}
                      alt={selectedSpaceData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{t('booking.space')}</p>
                      <p className="font-semibold text-sm md:text-base">{selectedSpaceData.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs md:text-sm">{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs md:text-sm">
                        {selectedTimeStart} - {selectedTimeEnd}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">{t('booking.status')}</p>
                      <Badge className="bg-status-pending/20 text-status-pending border-0 text-xs">{t('booking.pending')}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm">{t('booking.optionalNotes')}</Label>
                      <Input
                        id="notes"
                        placeholder={t('booking.notesPlaceholder')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="bg-secondary border-border text-sm"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSubmitBooking}
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('booking.submitting')}
                      </>
                    ) : (
                      t('booking.submitRequest')
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">{t('booking.selectSpaceFirst')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile: Sticky Bottom Booking Summary & Submit Button */}
      {isFormComplete && !bookingSubmitted && selectedSpaceData && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 p-4 max-h-[70vh] overflow-y-auto">
          <div className="container mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">{t('booking.bookingDetails')}</h3>
                <Badge className="bg-status-pending/20 text-status-pending border-0 text-xs">{t('booking.pending')}</Badge>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedSpaceData.image || "/placeholder.svg"}
                    alt={selectedSpaceData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{selectedSpaceData.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{selectedTimeStart} - {selectedTimeEnd}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes-mobile" className="text-xs">{t('booking.optionalNotes')}</Label>
                <Input
                  id="notes-mobile"
                  placeholder={t('booking.notesPlaceholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-secondary border-border text-sm"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleSubmitBooking}
                disabled={createBooking.isPending}
                size="lg"
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('booking.submitting')}
                  </>
                ) : (
                  t('booking.submitRequest')
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Booking Submitted Success */}
      {bookingSubmitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 p-4">
          <div className="container mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-status-approved/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-status-approved" />
            </div>
            <h3 className="font-semibold text-base mb-1">{t('booking.bookingCreated')}</h3>
            <p className="text-sm text-muted-foreground">{t('booking.pending')}</p>
          </div>
        </div>
      )}
    </main>
  )
}

export default function UserBookPage() {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <Suspense fallback={null}>
        <BookingContent />
      </Suspense>
    </div>
  )
}
