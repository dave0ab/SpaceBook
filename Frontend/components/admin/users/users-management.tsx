"use client";

import type React from "react";
import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAdminUsers } from "@/lib/hooks/use-admin";
import { Plus, Trash2, User, Loader2 } from "lucide-react";
import { useCreateUser, useDeleteUser } from "@/lib/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UsersManagementProps {
  initialUsers: any[];
}

export function UsersManagement({ initialUsers }: UsersManagementProps) {
  const { data: users = initialUsers, isLoading } = useAdminUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const t = useTranslations();

  const regularUsers = users.filter((u) => u.role === "user");

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || "password123",
        role: "user",
      });
      setNewUser({ name: "", email: "", password: "" });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm(t("users.deleteConfirm"))) {
      try {
        await deleteUser.mutateAsync(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4">
        <CardTitle className="text-lg">{t("users.usersManagement")}</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              {t("users.addUser")}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>{t("users.addUser")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("users.name")}</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder={t("users.enterName")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder={t("users.enterEmail")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder={t("users.enterPassword")}
                />
                <p className="text-xs text-muted-foreground">{t("users.leaveEmptyDefault")}</p>
              </div>
              <Button type="submit" className="w-full" disabled={createUser.isPending}>
                {createUser.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : t("users.addUser")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("users.name")}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("common.email")}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("users.role")}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.status")}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">{t("booking.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4 font-medium text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">{user.email}</td>
                  <td className="py-4 px-4"><Badge variant="secondary" className="capitalize text-xs">{user.role}</Badge></td>
                  <td className="py-4 px-4"><Badge className={cn("text-xs", user.status === "active" ? "bg-status-approved/20 text-status-approved" : "bg-muted text-muted-foreground")}>{user.status}</Badge></td>
                  <td className="py-4 px-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteUser.isPending}
                    >
                      {deleteUser.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
