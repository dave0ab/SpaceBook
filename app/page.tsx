import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Building2, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SpaceBook</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/user/login">
              <Button variant="ghost">User Login</Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline">Admin Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Book Sports & Event Spaces <span className="text-primary">Effortlessly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Reserve auditoriums, gyms, and soccer fields with our streamlined booking platform. Simple requests, quick
            approvals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user/login">
              <Button size="lg" className="gap-2">
                Start Booking <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Available Spaces</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-auditorium/20 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-auditorium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1 Auditorium</h3>
              <p className="text-muted-foreground">
                State-of-the-art auditorium with 500 seats, perfect for conferences and events.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gym/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gym" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1 Multipurpose Gym</h3>
              <p className="text-muted-foreground">
                Versatile gymnasium for basketball, volleyball, and indoor sports activities.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-soccer/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-soccer" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4 Soccer Fields</h3>
              <p className="text-muted-foreground">
                Professional-grade fields with natural and synthetic turf options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join our platform today and start booking spaces for your events and activities.
          </p>
          <Link href="/user/login">
            <Button size="lg" className="gap-2">
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">SpaceBook</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SpaceBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
