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
import { Button } from "../ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/app/components/ui/table";
import Loader from "@/app/components/ui/loader";
import { useEffect, useState, useTransition } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Trash2, Loader2 } from "lucide-react";
import { formatDateUTC } from "@/lib/utils";
import { UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";
import { deleteInterview } from "@/app/dashboard/actions";
import { toast } from "sonner";

export type InterviewHistoryType = {
  id: string;
  name: string;
  updatedAt?: Date; // Prefer updatedAt when available
  createdAt?: Date; // Fallback for candidate history data
  role: string;
  type: string;
  difficultyLevel: string;
  user?: {
    name: string | null;
    email: string;
  };
};

type InterviewHistoryTableProps = {
  globalFilterValue: string;
  query: UseQueryResult<any, Error>;
};

export function InterviewHistoryTable({
  globalFilterValue,
  query,
}: InterviewHistoryTableProps) {
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setGlobalFilter(globalFilterValue.trim() || "");
  }, [globalFilterValue]);

  const handleDelete = (interviewId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this interview history?")
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteInterview(interviewId);
      if (result.success) {
        toast.success(result.success);
        query.refetch(); // Refetch data to update the table
      } else {
        toast.error(result.error || "Failed to delete interview.");
      }
    });
  };

  const columns: ColumnDef<InterviewHistoryType>[] = [
    {
      accessorKey: "id",
      header: () => null,
      cell: () => null,
      enableSorting: false,
      enableHiding: true,
    },
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
              {user?.name || row.getValue("name")}
            </span>
            {user?.email && (
              <span className="text-xs text-gray-500">{user.email}</span>
            )}
          </div>
        );
      },
      size: 150,
    },
    {
      id: "completedDate",
      accessorFn: (row) => row.updatedAt ?? row.createdAt ?? null,
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const handleSort = () => column.toggleSorting(isSorted === "asc");
        return (
          <Button
            variant="ghost"
            onClick={handleSort}
            className="flex items-center gap-1"
          >
            Completed Date
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
            {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
          </Button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => {
        const raw = row.original.updatedAt ?? row.original.createdAt ?? null;
        return (
          <div className="lowercase" suppressHydrationWarning>
            {formatDateUTC(raw)}
          </div>
        );
      },
      size: 110,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("role")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("type")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "difficultyLevel",
      header: "Difficulty Level",
      cell: ({ row }) => {
        const type: "Easy" | "Medium" | "Hard" =
          row.getValue("difficultyLevel");
        return (
          <div
            className={`flex rounded-4xl max-w-[120px] justify-center items-center text-center ${
              type == "Easy"
                ? "bg-[#46c6c2]"
                : type == "Medium"
                ? "bg-[#ffb700]"
                : "bg-[#f63737]"
            }`}
          >
            <span className="text-center p-2 ">
              {row.getValue("difficultyLevel")}
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
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/feedback/${row.original.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    columns,
    data: query.data || [],
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    initialState: { columnVisibility: { id: false } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setpagination,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  return (
    <div className="space-y-4 bg-white min-h-[465px] flex flex-col justify-between px-10 py-4 rounded-4xl z-50">
      {query.isFetching ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : (
        <>
          <Table className="w-full h-full overflow-auto">
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
            <TableBody className="h-full">
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

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
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
        </>
      )}
    </div>
  );
}
