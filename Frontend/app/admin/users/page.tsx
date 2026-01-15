'use client';

"use client"

import type React from "react"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAdminUsers } from "@/lib/hooks/use-admin"
import { useCreateUser, useDeleteUser } from "@/lib/hooks/use-users"
import { Plus, Trash2, User, Loader2 } from "lucide-react"
import { useTranslations } from '@/lib/i18n'

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
        password: newUser.password || "password123", // Default password, should be changed by user
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
        <div className="flex-1 flex flex-col">
          <AdminTopbar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('users.usersManagement')}</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('users.addUser')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{t('users.addUser')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('users.name')}</Label>
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
                      <Label htmlFor="email">{t('common.email')}</Label>
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
                      <Label htmlFor="password">{t('common.password')}</Label>
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
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('users.name')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('common.email')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('users.role')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.status')}</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('booking.actions')}</th>
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
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="capitalize">
                            {user.role === 'admin' ? t('users.admin') : t('users.user')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              user.status === "active"
                                ? "bg-status-approved/20 text-status-approved border-0"
                                : "bg-muted text-muted-foreground border-0"
                            }
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
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
