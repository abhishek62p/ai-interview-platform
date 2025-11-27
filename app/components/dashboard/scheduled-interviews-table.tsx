"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FetchScheduledInterviews, ScheduledInterviewType } from '@/hooks/react-query/functions';
import { formatDateTimeUTC } from '@/lib/utils';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Loader from '../ui/loader';

export const scheduledColumns: ColumnDef<ScheduledInterviewType[number]>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(isSorted === 'asc')} className="flex items-center gap-1">
          Title
          {isSorted === 'asc' && <ArrowUp className="w-4 h-4" />}
          {isSorted === 'desc' && <ArrowDown className="w-4 h-4" />}
          {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'user',
    header: 'Candidate',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span>{user.name || 'N/A'}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'scheduledAt',
    header: 'Scheduled At',
    cell: ({ row }) => <span suppressHydrationWarning>{row.original.scheduledAt ? formatDateTimeUTC(row.original.scheduledAt) : '—'}</span>
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires',
    cell: ({ row }) => <span suppressHydrationWarning>{row.original.expiresAt ? formatDateTimeUTC(row.original.expiresAt) : '—'}</span>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const color = status === 'COMPLETED' ? 'text-green-600' : status === 'EXPIRED' ? 'text-red-600' : 'text-yellow-600';
      return <span className={`font-semibold ${color}`}>{status}</span>;
    }
  }
];

export default function ScheduledInterviewsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['scheduled','interviews'], queryFn: FetchScheduledInterviews });

  const table = useReactTable({
    data: data || [],
    columns: scheduledColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const interval = setInterval(() => refetch(), 60_000); // refresh every minute for status
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-red-600 text-sm">{(error as Error).message}</div>;

  return (
    <div className="space-y-4 bg-white min-h-[465px] flex flex-col justify-between px-10 py-4 rounded-4xl z-50 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Scheduled Interviews</h3>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
      </div>
      <Table className="w-full h-full overflow-auto">
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="p-2 bg-transparent text-left border-b-2 border-gray-400 border-dotted"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="h-full">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="p-4 border-none rounded-[45px] hover:bg-[#e7e9fb]" key={row.id}>
                {row.getVisibleCells().map((cell, i) => {
                  const isFirst = i === 0;
                  const isLast = i === row.getVisibleCells().length - 1;
                  return (
                    <TableCell
                      key={cell.id}
                      className={`p-4 ${isFirst ? 'rounded-l-[45px]' : ''} ${isLast ? 'rounded-r-[45px]' : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={scheduledColumns.length} className="text-center py-6 text-sm">No scheduled interviews</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
