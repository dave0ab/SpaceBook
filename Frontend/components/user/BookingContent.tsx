"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/lib/providers/auth-provider";
import { useSpaces } from "@/lib/hooks/use-spaces";
import { useBookings, useCreateBooking } from "@/lib/hooks/use-bookings";
import { type SpaceType } from "@/lib/types";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Search, CheckCircle, Loader2, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from '@/lib/i18n';

// Time slots constant
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

import { motion } from "framer-motion";
import { Space } from "@/lib/types";

interface BookingContentProps {
  initialSpaces?: Space[];
}

export function BookingContent({ initialSpaces = [] }: BookingContentProps = {}) {
  const { user } = useAuth();
  const t = useTranslations();
  
  // State declarations
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeStart, setSelectedTimeStart] = useState("");
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("");
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType | "all">("all");
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  
  // Hooks
  const { data: spaces = [], isLoading: spacesLoading } = useSpaces(
    selectedSpaceType === "all" ? undefined : selectedSpaceType
  );
  
  // Use initialSpaces for first render if no filters applied and loading
  const displaySpaces = (selectedSpaceType === "all" && spaces.length === 0) ? initialSpaces : spaces;
  
  const { data: bookings = [] } = useBookings();
  const createBooking = useCreateBooking();

  // Filter spaces based on search criteria
  const filteredSpaces = selectedSpaceType === "all" 
    ? displaySpaces 
    : displaySpaces.filter((space) => space.type === selectedSpaceType);

  // Check availability logic remains same...
  const getSpaceAvailability = (spaceId: string) => {
    if (!selectedDate || !selectedTimeStart || !selectedTimeEnd) return "available";

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
    );

    if (conflictingBooking) {
      return conflictingBooking.status === "pending" ? "pending" : "booked";
    }
    return "available";
  };

  const handleSubmitBooking = async () => {
    if (!selectedSpace || !selectedDate || !selectedTimeStart || !selectedTimeEnd || !user) return;

    try {
      await createBooking.mutateAsync({
        spaceId: selectedSpace,
        date: selectedDate,
        startTime: selectedTimeStart,
        endTime: selectedTimeEnd,
        notes: notes || undefined,
      });

      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingSubmitted(false);
        setSelectedSpace(null);
        setSelectedDate("");
        setSelectedTimeStart("");
        setSelectedTimeEnd("");
        setNotes("");
      }, 3000);
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const selectedSpaceData = selectedSpace ? displaySpaces.find((s) => s.id === selectedSpace) : null;

  const showBottomSheet = selectedSpaceData && selectedDate && selectedTimeStart && selectedTimeEnd && !bookingSubmitted;

  // Prevent body scroll when bottom sheet is open on mobile/tablet
  useEffect(() => {
    if (showBottomSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showBottomSheet]);

  // Prevent background scroll when the bottom sheet is open (mobile/tablet).
  useEffect(() => {
    if (!showBottomSheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showBottomSheet]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-24 lg:pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-12"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            BOOKING
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 font-serif tracking-tight">{t('booking.bookSpace')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground font-normal max-w-2xl">{t('booking.selectSpaceFirst')}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {/* Search & Filter */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-10">
          {/* Search Form */}
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border border-border/60 shadow-none rounded-xl">
                <CardHeader className="pb-3 sm:pb-4 border-b border-border/40">
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg font-medium">
                        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                            <Search className="h-4 w-4 text-primary" />
                        </div>
                        {t('common.search')} {t('spaces.spaces')}
                    </CardTitle>
                </CardHeader>

                {/* Mobile/Tablet: always-visible filters */}
                <CardContent className="lg:hidden pt-4 sm:pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('booking.date')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background hover:bg-muted border-input h-10 rounded-lg",
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
                                setSelectedDate(format(date, "yyyy-MM-dd"));
                              }
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('booking.startTime')}</Label>
                      <Select value={selectedTimeStart} onValueChange={setSelectedTimeStart}>
                        <SelectTrigger className="bg-background hover:bg-muted h-10 rounded-lg">
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
                      <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('booking.endTime')}</Label>
                      <Select value={selectedTimeEnd} onValueChange={setSelectedTimeEnd}>
                        <SelectTrigger className="bg-background hover:bg-muted h-10 rounded-lg">
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
                      <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('spaces.type')}</Label>
                      <Select value={selectedSpaceType} onValueChange={(v) => setSelectedSpaceType(v as SpaceType | "all")}>
                        <SelectTrigger className="bg-background hover:bg-muted h-10 rounded-lg">
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

                {/* Desktop: always-visible filters */}
                <CardContent className="hidden lg:block pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('booking.date')}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                            "w-full justify-start text-left font-normal bg-background hover:bg-muted border-input h-10 rounded-lg",
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
                                setSelectedDate(format(date, "yyyy-MM-dd"));
                            }
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    </div>
                    <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('booking.startTime')}</Label>
                    <Select value={selectedTimeStart} onValueChange={setSelectedTimeStart}>
                        <SelectTrigger className="bg-background hover:bg-muted h-10 rounded-lg">
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
                    <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('booking.endTime')}</Label>
                    <Select value={selectedTimeEnd} onValueChange={setSelectedTimeEnd}>
                        <SelectTrigger className="bg-background hover:bg-muted h-10 rounded-lg">
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
                    <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wide">{t('spaces.type')}</Label>
                    <Select value={selectedSpaceType} onValueChange={(v) => setSelectedSpaceType(v as SpaceType | "all")}>
                        <SelectTrigger className="bg-background hover:bg-muted h-10 rounded-lg">
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
          </motion.div>

          {/* Available Spaces */}
          <div className="space-y-4 sm:space-y-6">
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-serif font-semibold pl-1 tracking-tight"
            >
                {t('spaces.allSpaces')}
            </motion.h2>
            
            {spacesLoading ? (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-center py-12 sm:py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
                <p className="text-sm sm:text-base">{t('common.noResults')}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {filteredSpaces.map((space, idx) => {
                const availability = getSpaceAvailability(space.id);
                const isSelected = selectedSpace === space.id;
                return (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <Card
                        className={cn(
                        "group bg-card border border-border/60 cursor-pointer transition-all duration-300 shadow-none overflow-hidden h-full flex flex-col hover:border-primary/50 hover:bg-secondary/10",
                        isSelected && "ring-2 ring-primary border-primary bg-primary/10 shadow-md shadow-primary/20",
                        availability === "booked" && "opacity-60 cursor-not-allowed grayscale",
                        )}
                        onClick={() => {
                        if (availability !== "booked") {
                            setSelectedSpace(isSelected ? null : space.id);
                        }
                        }}
                    >
                        <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden rounded-t-xl">
                        <Image
                            src={space.image || "/placeholder.svg"}
                            alt={space.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                        
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2">
                             <Badge variant="secondary" className="bg-background/90 backdrop-blur-md shadow-none border-0 self-end font-medium text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                                {space.type === 'auditorium' ? t('spaces.auditorium') : 
                                space.type === 'gym' ? t('spaces.gym') : 
                                t('spaces.soccer')}
                            </Badge>
                            
                            {availability === "available" && (
                            <Badge className="bg-emerald-500/90 text-white border-0 self-end shadow-none text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">{t('booking.approved')}</Badge>
                            )}
                            {availability === "pending" && (
                            <Badge className="bg-amber-500/90 text-white border-0 self-end shadow-none text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">{t('booking.pending')}</Badge>
                            )}
                            {availability === "booked" && (
                            <Badge className="bg-red-500/90 text-white border-0 self-end shadow-none text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">{t('booking.rejected')}</Badge>
                            )}
                        </div>
                        
                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 lg:bottom-4 lg:left-4 text-white">
                            <h3 className="font-semibold text-sm sm:text-base lg:text-lg tracking-wide">{space.name}</h3>
                        </div>
                        </div>
                        <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 lg:mb-4 line-clamp-2 leading-relaxed flex-1">{space.description}</p>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-3 border-t border-border/40">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            <span>{space.capacity} {t('spaces.people')}</span>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              </div>
            )}
          </div>
        </div>

        {/* Booking Summary - Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="sticky top-28"
          >
             <Card className="bg-card/95 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5 overflow-hidden rounded-xl">
                <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-500" />
                <CardHeader>
                <CardTitle className="font-serif text-xl">{t('booking.bookingDetails')}</CardTitle>
                </CardHeader>
                <CardContent>
                {bookingSubmitted ? (
                    <div className="text-center py-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{t('booking.bookingCreated')}</h3>
                    <p className="text-muted-foreground">{t('booking.pending')}</p>
                    </div>
                ) : selectedSpaceData && selectedDate && selectedTimeStart && selectedTimeEnd ? (
                    <div className="space-y-6">
                    <div className="relative h-40 rounded-lg overflow-hidden shadow-none border border-border/20">
                        <Image
                        src={selectedSpaceData.image || "/placeholder.svg"}
                        alt={selectedSpaceData.name}
                        fill
                        className="object-cover"
                        />
                         <div className="absolute inset-0 bg-black/40" />
                         <div className="absolute bottom-3 left-3 text-white font-semibold text-lg">
                            {selectedSpaceData.name}
                         </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-primary shadow-sm border border-border/40">
                                    <CalendarIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Date</p>
                                    <p className="text-sm font-medium">{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-primary shadow-sm border border-border/40">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Time</p>
                                    <p className="text-sm font-medium">{selectedTimeStart} - {selectedTimeEnd}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="notes" className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">{t('booking.optionalNotes')}</Label>
                        <Input
                            id="notes"
                            placeholder={t('booking.notesPlaceholder')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-background border-input rounded-lg"
                        />
                        </div>
                    </div>
                    
                    <Button 
                        className="w-full h-12 rounded-lg text-base font-medium shadow-none hover:bg-primary/90 transition-all border border-transparent" 
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
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border/60 rounded-lg bg-secondary/10">
                    <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t('booking.selectSpaceFirst')}</p>
                    </div>
                )}
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Mobile/Tablet Floating Bottom Sheet */}
      {showBottomSheet && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpace(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 lg:hidden z-50 max-h-[65vh] sm:max-h-[75vh] overflow-y-auto overscroll-contain"
          >
            <Card className="bg-card/95 backdrop-blur-md border-t border-l border-r border-border/60 shadow-2xl rounded-t-2xl rounded-b-none m-0">
              <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-500" />
              
              {/* Drag Handle */}
              <div className="flex items-center justify-center pt-2 pb-1.5">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>

              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-2 sm:pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-base sm:text-lg">{t('booking.bookingDetails')}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedSpace(null)}
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 px-4 sm:px-6" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                {/* Space Image - Compact Horizontal Layout */}
                <div className="relative h-24 sm:h-32 rounded-lg overflow-hidden shadow-sm border border-border/20">
                  <Image
                    src={selectedSpaceData.image || "/placeholder.svg"}
                    alt={selectedSpaceData.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white font-semibold text-sm sm:text-base">
                    {selectedSpaceData.name}
                  </div>
                </div>

                {/* Date and Time - Condensed */}
                <div className="p-2.5 sm:p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-background flex items-center justify-center text-primary shadow-sm border border-border/40 flex-shrink-0">
                      <CalendarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Date</p>
                      <p className="text-xs sm:text-sm font-medium truncate">
                        <span className="hidden sm:inline">{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}</span>
                        <span className="sm:hidden">{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "MMM d, yyyy")}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-background flex items-center justify-center text-primary shadow-sm border border-border/40 flex-shrink-0">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Time</p>
                      <p className="text-xs sm:text-sm font-medium">{selectedTimeStart} - {selectedTimeEnd}</p>
                    </div>
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="notes-mobile" className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold tracking-wide">
                    {t('booking.optionalNotes')}
                  </Label>
                  <Input
                    id="notes-mobile"
                    placeholder={t('booking.notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-background border-input rounded-lg h-10 sm:h-11 text-sm"
                  />
                </div>

                {/* Submit Button - Touch Friendly */}
                <Button 
                  className="w-full h-11 sm:h-12 rounded-lg text-sm font-medium shadow-none hover:bg-primary/90 transition-all border border-transparent mt-1 sm:mt-2" 
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
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </main>
  );
}
