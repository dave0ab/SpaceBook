'use client';

import type React from "react"
import { useState } from "react"
import { useTranslations } from '@/lib/i18n'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAdminUsers } from "@/lib/hooks/use-admin"
import { AdminTopbar } from "@/components/admin/topbar"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Plus, Trash2, User, Loader2 } from "lucide-react"
import { useCreateUser, useDeleteUser } from "@/lib/hooks/use-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAdminUsers()
  const createUser = useCreateUser()
  const deleteUser = useDeleteUser()
  const [open, setOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" })
  const t = useTranslations()

  const regularUsers = users.filter((u) => u.role === "user")

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUser.mutateAsync({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || "password123",
        role: "user",
      })
      setNewUser({ name: "", email: "", password: "" })
      setOpen(false)
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to create user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm(t('users.deleteConfirm'))) {
      try {
        await deleteUser.mutateAsync(userId)
      } catch (error) {
        // Error handling is done in the mutation hook
        console.error("Failed to delete user:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full md:w-auto">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col w-full md:w-auto">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 md:p-6 pb-4">
              <CardTitle className="text-base md:text-lg">{t('users.usersManagement')}</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    {t('users.addUser')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border w-[95vw] max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-base md:text-lg">{t('users.addUser')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">{t('users.name')}</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder={t('users.enterName')}
                        className="bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">{t('common.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder={t('users.enterEmail')}
                        className="bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">{t('common.password')}</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder={t('users.enterPassword')}
                        className="bg-secondary border-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('users.leaveEmptyDefault')}
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={createUser.isPending}>
                      {createUser.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('users.creating')}
                        </>
                      ) : (
                        t('users.addUser')
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {regularUsers.map((user) => (
                  <Card key={user.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUser.isPending}
                        >
                          {deleteUser.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {user.role === 'admin' ? t('users.admin') : t('users.user')}
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            user.status === "active"
                              ? "bg-status-approved/20 text-status-approved border-0"
                              : "bg-muted text-muted-foreground border-0"
                          }`}
                        >
                          {user.status === 'active' ? t('users.active') : t('users.inactive')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {regularUsers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {t('users.noUsers') || 'No users found'}
                  </div>
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t('users.name')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t('common.email')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t('users.role')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t('booking.status')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t('booking.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {user.role === 'admin' ? t('users.admin') : t('users.user')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={`text-xs ${
                              user.status === "active"
                                ? "bg-status-approved/20 text-status-approved border-0"
                                : "bg-muted text-muted-foreground border-0"
                            }`}
                          >
                            {user.status === 'active' ? t('users.active') : t('users.inactive')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUser.isPending}
                          >
                            {deleteUser.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {regularUsers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {t('users.noUsers') || 'No users found'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
