'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Building2, ArrowRight } from "lucide-react"
import { useTranslations } from '@/lib/i18n'
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">{t('common.appName')}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/user/login">
              <Button variant="ghost">{t('common.userLogin')}</Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline">{t('common.adminLogin')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            {t('home.heroTitle')} <span className="text-primary">{t('home.heroHighlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            {t('home.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user/login">
              <Button size="lg" className="gap-2">
                {t('common.userLogin')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline">
                {t('home.adminPortal')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.availableSpaces')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-auditorium/20 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-auditorium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.auditorium')}</h3>
              <p className="text-muted-foreground">
                {t('home.auditoriumDesc')}
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gym/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gym" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.gym')}</h3>
              <p className="text-muted-foreground">
                {t('home.gymDesc')}
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-soccer/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-soccer" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.soccerFields')}</h3>
              <p className="text-muted-foreground">
                {t('home.soccerFieldsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t('home.ctaDescription')}
          </p>
          <Link href="/user/login">
            <Button size="lg" className="gap-2">
              {t('common.signIn')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">{t('common.appName')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('common.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  )
}
