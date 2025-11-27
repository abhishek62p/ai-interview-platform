"use client"

import * as React from "react"
import {
    ColumnDef,
    PaginationState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table"
import { Button } from "../../ui/button"
import { useEffect, useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import Loader from "../../ui/loader"

export type RegisteredUserType = {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    totalInterviews: number;
    completedInterviews: number;
    averageScore: number;
};

export const columns: ColumnDef<RegisteredUserType>[] = [
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
                    Name
                    {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
                    {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
                    {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize font-medium">{row.getValue("name") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "totalInterviews",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            const handleSort = () => column.toggleSorting(isSorted === "asc");

            return (
                <Button
                    variant="ghost"
                    onClick={handleSort}
                    className="flex items-center gap-1"
                >
                    Mock Interviews
                    {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
                    {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
                    {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("totalInterviews")} ({row.original.completedInterviews} completed)
            </div>
        ),
    },
    {
        accessorKey: "averageScore",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            const handleSort = () => column.toggleSorting(isSorted === "asc");

            return (
                <Button
                    variant="ghost"
                    onClick={handleSort}
                    className="flex items-center gap-1"
                >
                    Avg Score
                    {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
                    {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
                    {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                </Button>
            );
        },
        cell: ({ row }) => {
            const score = row.getValue("averageScore") as number;
            const colorClass = score >= 70 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";
            return (
                <div className={`text-center font-semibold ${colorClass}`}>
                    {score > 0 ? `${score}%` : "N/A"}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={() => {
                        // Store candidate data in sessionStorage
                        sessionStorage.setItem('scheduleCandidate', JSON.stringify({
                            email: user.email,
                            name: user.name || ""
                        }));
                        
                        // Dispatch custom event to change tab
                        window.dispatchEvent(new CustomEvent('changeTab', {
                            detail: { tab: 'hr_schedule' }
                        }));
                    }}
                >
                    <Calendar className="w-4 h-4" />
                    Schedule
                </Button>
            );
        },
    },
];

type RegisteredUsersTableProps = {
    globalFilterValue: string;
    query: UseQueryResult<RegisteredUserType[], Error>;
};

export function RegisteredUsersTable({ globalFilterValue, query }: RegisteredUsersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: query.data || [],
        columns,
        state: {
            sorting,
            pagination,
            globalFilter: globalFilterValue,
            columnVisibility: { id: false },
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: false,
    });

    if (query.isLoading) {
        return <Loader />;
    }

    if (query.isError) {
        return <div className="text-center py-10 text-red-600">Error loading candidates</div>;
    }

    return (
        <div className="space-y-4 bg-white min-h-[465px] flex flex-col justify-between px-10 py-4 rounded-4xl z-50 w-full">
            <Table className="w-full h-full overflow-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="p-2 bg-transparent text-left border-b-2 border-gray-400 border-dotted">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="h-full">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="p-4 border-none rounded-[45px] hover:bg-[#e7e9fb]" data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell, i) => {
                                    const isFirst = i === 0;
                                    const isLast = i === row.getVisibleCells().length - 1;
                                    return (
                                        <TableCell key={cell.id} className={`p-4 ${isFirst ? 'rounded-l-[45px]' : ''} ${isLast ? 'rounded-r-[45px]' : ''}`}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No candidates found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-2">
                <div className="flex-1 text-sm text-gray-600">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="space-x-2">
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
        </div>
    );
}
