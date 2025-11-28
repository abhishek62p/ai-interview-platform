"use client"

import {
  SortingState,
  PaginationState,
  useReactTable,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "../../ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/app/components/ui/table";
import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { formatDateUTC } from "@/lib/utils";
import Link from "next/link";

type CompletedInterviewType = {
  id: string;
  name: string;
  user: { name: string | null; email: string };
  updatedAt: Date;
  averageScore: number;
};

type CompletedInterviewsTableProps = {
  data: CompletedInterviewType[];
};

export function CompletedInterviewsTable({ data }: CompletedInterviewsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns: ColumnDef<CompletedInterviewType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const handleSort = () => column.toggleSorting(isSorted === "asc");

        return (
          <Button
            variant="ghost"
            onClick={handleSort}
            className="flex items-center gap-1"
          >
            Interview
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
            {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "user",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const handleSort = () => column.toggleSorting(isSorted === "asc");

        return (
          <Button
            variant="ghost"
            onClick={handleSort}
            className="flex items-center gap-1"
          >
            Candidate
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
            {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-medium capitalize">
              {user.name}
            </span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const handleSort = () => column.toggleSorting(isSorted === "asc");

        return (
          <Button
            variant="ghost"
            onClick={handleSort}
            className="flex items-center gap-1"
          >
            Completed On
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
            {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
          </Button>
        );
      },
      cell: ({ row }) => {
        const raw = row.getValue<Date>("updatedAt");
        return (
          <div suppressHydrationWarning>
            {formatDateUTC(raw)}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "averageScore",
      header: "Avg Score",
      cell: ({ row }) => {
        const score = row.getValue<number>("averageScore");
        return (
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              score >= 8
                ? 'bg-green-100 text-green-700'
                : score >= 6
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {score}/10
            </span>
          </div>
        );
      },
      size: 100,
    },
    {
      id: "actions",
      header: () => "Actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Link href={`/dashboard/feedback/${row.original.id}`}>
            <Button variant="outline" size="sm">
              View Report
            </Button>
          </Link>
        </div>
      ),
      size: 100,
    },
  ];

  const table = useReactTable({
    columns,
    data: data || [],
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 bg-white min-h-[465px] flex flex-col justify-between px-10 py-4 rounded-4xl z-50">
      <div>
        <h3 className="text-xl font-semibold text-dark mb-4">Recently Completed Interviews</h3>
        {data.length > 0 ? (
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="p-2 bg-transparent text-left border-b-2 border-gray-400 border-dotted"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  className="p-4 border-none rounded-[45px] hover:bg-[#e7e9fb]"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell, i) => {
                    const isFirst = i === 0;
                    const isLast = i === row.getVisibleCells().length - 1;

                    return (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`p-4 ${isFirst ? "rounded-l-[45px]" : ""} ${
                          isLast ? "rounded-r-[45px]" : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No completed interviews yet.
          </p>
        )}
      </div>

      {data.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
