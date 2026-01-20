'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { useTranslations } from '@/lib/i18n';

export type TimePeriod = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear' | 'allTime';

interface TimePeriodSelectorProps {
  value?: TimePeriod;
  onChange?: (period: TimePeriod, startDate: string, endDate: string) => void;
}

export function TimePeriodSelector({ value = 'thisMonth', onChange }: TimePeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(value);
  const t = useTranslations();

  const calculateDates = (period: TimePeriod): { startDate: string; endDate: string } => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'thisWeek':
        start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'thisYear':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'allTime':
        // Use a very early date and current date
        start = new Date(2020, 0, 1);
        end = now;
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    };
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    const { startDate, endDate } = calculateDates(period);
    onChange?.(period, startDate, endDate);
  };

  // Initialize with default period
  useEffect(() => {
    const { startDate, endDate } = calculateDates(selectedPeriod);
    onChange?.(selectedPeriod, startDate, endDate);
  }, []);

  const getDateRangeLabel = (period: TimePeriod): string => {
    const { startDate, endDate } = calculateDates(period);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (period === 'allTime') {
      return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
    }
    
    if (period === 'today') {
      return format(start, 'MMM d, yyyy');
    }
    
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">
          {t('dashboard.timePeriod')}:
        </label>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{t('dashboard.today')}</SelectItem>
            <SelectItem value="thisWeek">{t('dashboard.thisWeek')}</SelectItem>
            <SelectItem value="thisMonth">{t('dashboard.thisMonth')}</SelectItem>
            <SelectItem value="thisYear">{t('dashboard.thisYear')}</SelectItem>
            <SelectItem value="allTime">{t('dashboard.allTime')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-muted-foreground">
        {getDateRangeLabel(selectedPeriod)}
      </div>
    </div>
  );
}

