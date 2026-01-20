import { Suspense } from "react"
import { BookingContent } from "@/components/user/BookingContent"

export default function UserBookPage() {
  return (
    <Suspense fallback={null}>
      <BookingContent />
    </Suspense>
  )
}
