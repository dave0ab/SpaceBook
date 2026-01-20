'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface StatisticsTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function StatisticsTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  isLoading = false,
  emptyMessage,
  className,
}: StatisticsTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const t = useTranslations();

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle date strings (YYYY-MM-DD format)
      if (String(sortKey).includes('date') || String(sortKey).includes('Date')) {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        if (!isNaN(aDate) && !isNaN(bDate)) {
          return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: keyof T | string) => {
    if (sortKey !== key || !sortDirection) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <Card className={`bg-card border-border ${className || ''}`}>
      <CardHeader className="p-4 md:p-6 pb-4">
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            {emptyMessage || t('dashboard.noDataAvailable')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={column.className || ''}
                    >
                      {column.sortable !== false ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort(column.key)}
                        >
                          <div className="flex items-center gap-2">
                            {column.label}
                            {getSortIcon(column.key)}
                          </div>
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={column.className || ''}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

