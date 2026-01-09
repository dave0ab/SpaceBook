"use client"

import { Suspense, useState } from "react"
import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useBooking } from "@/lib/booking-context"
import { spaces, timeSlots, type SpaceType } from "@/lib/mock-data"
import { format, parse } from "date-fns"
import { Calendar, Clock, Users, Search, CheckCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

function BookingContent() {
  const { bookings, currentUser, addBooking } = useBooking()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeStart, setSelectedTimeStart] = useState("")
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("")
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType | "all">("all")
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [bookingSubmitted, setBookingSubmitted] = useState(false)

  // Filter spaces based on search criteria
  const filteredSpaces = spaces.filter((space) => {
    if (selectedSpaceType !== "all" && space.type !== selectedSpaceType) return false
    return true
  })

  // Check availability
  const getSpaceAvailability = (spaceId: string) => {
    if (!selectedDate || !selectedTimeStart || !selectedTimeEnd) return "available"

    const conflictingBooking = bookings.find(
      (b) =>
        b.spaceId === spaceId &&
        b.date === selectedDate &&
        b.status !== "rejected" &&
        ((b.startTime <= selectedTimeStart && b.endTime > selectedTimeStart) ||
          (b.startTime < selectedTimeEnd && b.endTime >= selectedTimeEnd) ||
          (b.startTime >= selectedTimeStart && b.endTime <= selectedTimeEnd)),
    )

    if (conflictingBooking) {
      return conflictingBooking.status === "pending" ? "pending" : "booked"
    }
    return "available"
  }

  const handleSubmitBooking = () => {
    if (!selectedSpace || !selectedDate || !selectedTimeStart || !selectedTimeEnd || !currentUser) return

    addBooking({
      userId: currentUser.id,
      spaceId: selectedSpace,
      date: selectedDate,
      startTime: selectedTimeStart,
      endTime: selectedTimeEnd,
      status: "pending",
      notes: notes || undefined,
    })

    setBookingSubmitted(true)
    setTimeout(() => {
      setBookingSubmitted(false)
      setSelectedSpace(null)
      setNotes("")
    }, 3000)
  }

  const selectedSpaceData = selectedSpace ? spaces.find((s) => s.id === selectedSpace) : null

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Space</h1>
        <p className="text-muted-foreground">Search and book available spaces for your events</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Search & Filter */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Spaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={selectedTimeStart} onValueChange={setSelectedTimeStart}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select time" />
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
                  <Label>End Time</Label>
                  <Select value={selectedTimeEnd} onValueChange={setSelectedTimeEnd}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select time" />
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
                  <Label>Space Type</Label>
                  <Select value={selectedSpaceType} onValueChange={(v) => setSelectedSpaceType(v as SpaceType | "all")}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="auditorium">Auditorium</SelectItem>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="soccer">Soccer Fields</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Spaces */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Spaces</h2>
            <div className="grid sm:grid-cols-2 gap-4">
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
                    <div className="relative h-40">
                      <Image
                        src={space.image || "/placeholder.svg"}
                        alt={space.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {availability === "available" && (
                          <Badge className="bg-status-approved/90 text-background border-0">Available</Badge>
                        )}
                        {availability === "pending" && (
                          <Badge className="bg-status-pending/90 text-background border-0">Pending</Badge>
                        )}
                        {availability === "booked" && (
                          <Badge className="bg-status-rejected/90 text-foreground border-0">Booked</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{space.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{space.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{space.capacity}</span>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {space.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-status-approved/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-status-approved" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Booking Submitted!</h3>
                  <p className="text-muted-foreground">Your request is pending approval</p>
                </div>
              ) : selectedSpaceData && selectedDate && selectedTimeStart && selectedTimeEnd ? (
                <div className="space-y-6">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={selectedSpaceData.image || "/placeholder.svg"}
                      alt={selectedSpaceData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Space</p>
                      <p className="font-semibold">{selectedSpaceData.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedTimeStart} - {selectedTimeEnd}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className="bg-status-pending/20 text-status-pending border-0">Pending Approval</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Add any notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleSubmitBooking}>
                    Submit Booking Request
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a date, time, and space to see your booking summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
