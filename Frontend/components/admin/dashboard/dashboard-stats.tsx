"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  ClipboardList,
  Users,
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    label: string;
    value: number;
    icon: any;
    color: string;
  }[];
}

const iconMap: Record<string, React.ElementType> = {
  "clipboard-list": ClipboardList,
  "clock": Clock,
  "check-circle": CheckCircle,
  "users": Users,
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || ClipboardList;
        return (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2 md:p-3 rounded-lg bg-secondary ${stat.color}`}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
