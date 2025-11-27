import { SortingState, PaginationState, useReactTable, getFilteredRowModel, getCoreRowModel, getSortedRowModel, getPaginationRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '../ui/table';
import Loader from '../ui/loader';
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Link } from 'lucide-react';
import { FeedBackDialog } from './feedback-dialog';
import { formatDateUTC } from '@/lib/utils';
import { UseQueryResult } from '@tanstack/react-query';

export type InterviewHistoryType = {
  id: string;
  name: string;
  completedAt: Date;
  role: string;
  type: string;
  difficultyLevel: string;
  feedBack: any; // can be string or object from API
};

export const interviewHistoryData: InterviewHistoryType[] = [
  {
    id: '1',
    name: 'Frontend Developer Mock',
    completedAt: new Date('2025-08-01T10:30:00'),
    role: 'Frontend Developer',
    type: 'Mock',
    difficultyLevel: 'Medium',
    feedBack: 'Good understanding of React basics, but needs improvement in performance optimization.',
  },
  {
    id: '2',
    name: 'Backend Developer Practice',
    completedAt: new Date('2025-08-02T15:00:00'),
    role: 'Backend Developer',
    type: 'Practice',
    difficultyLevel: 'Hard',
    feedBack: 'Excellent API design skills, but database query optimization can be improved.',
  },
  {
    id: '3',
    name: 'Fullstack Developer Mock',
    completedAt: new Date('2025-08-03T09:15:00'),
    role: 'Fullstack Developer',
    type: 'Mock',
    difficultyLevel: 'Easy',
    feedBack: 'Strong problem-solving, but struggled with advanced CSS layouts.',
  },
  {
    id: '4',
    name: 'Data Analyst Practice',
    completedAt: new Date('2025-08-04T14:45:00'),
    role: 'Data Analyst',
    type: 'Practice',
    difficultyLevel: 'Medium',
    feedBack: 'Good data visualization skills, minor issues with SQL joins.',
  },
  {
    id: '5',
    name: 'Machine Learning Engineer Mock',
    completedAt: new Date('2025-08-05T11:20:00'),
    role: 'Machine Learning Engineer',
    type: 'Mock',
    difficultyLevel: 'Hard',
    feedBack: 'Great model selection, but needs better explanation of hyperparameter tuning.',
  },
  {
    id: '6',
    name: 'DevOps Engineer Practice',
    completedAt: new Date('2025-08-06T13:50:00'),
    role: 'DevOps Engineer',
    type: 'Practice',
    difficultyLevel: 'Medium',
    feedBack: 'Solid CI/CD pipeline setup, could improve Kubernetes troubleshooting speed.',
  },
  {
    id: '7',
    name: 'UI/UX Designer Mock',
    completedAt: new Date('2025-08-07T10:10:00'),
    role: 'UI/UX Designer',
    type: 'Mock',
    difficultyLevel: 'Easy',
    feedBack: 'Creative designs but needs more focus on accessibility best practices.',
  },
  {
    id: '8',
    name: 'Cybersecurity Analyst Practice',
    completedAt: new Date('2025-08-07T16:40:00'),
    role: 'Cybersecurity Analyst',
    type: 'Practice',
    difficultyLevel: 'Hard',
    feedBack: 'Good knowledge of OWASP Top 10, but incident response strategy was lacking.',
  },
  {
    id: '9',
    name: 'Cloud Architect Mock',
    completedAt: new Date('2025-08-08T12:00:00'),
    role: 'Cloud Architect',
    type: 'Mock',
    difficultyLevel: 'Medium',
    feedBack: 'Strong AWS architecture skills, but Azure services understanding is limited.',
  },
  {
    id: '10',
    name: 'Mobile App Developer Practice',
    completedAt: new Date('2025-08-09T09:50:00'),
    role: 'Mobile App Developer',
    type: 'Practice',
    difficultyLevel: 'Easy',
    feedBack: 'Good Flutter skills, but state management could be improved for scalability.',
  },
];

type InterviewHistoryTableProps = {
  globalFilterValue: string,
  query: UseQueryResult<any, Error>;
};

export const columns: ColumnDef<InterviewHistoryType>[] = [
  {
    accessorKey: "id",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: true,
  }
  ,
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
          aria-label={`Sort by CreatedAt ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          Name
          {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
          {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
    size: 100
  }
  ,
  {
    accessorKey: "completedAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const handleSort = () => column.toggleSorting(isSorted === "asc");

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          className="flex items-center gap-1"
          aria-label={`Sort by CreatedAt ${isSorted === "asc" ? "descending" : "ascending"}`}
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
      const raw = row.getValue<Date>("completedAt");
      return <div className="lowercase" suppressHydrationWarning>{formatDateUTC(raw)}</div>;
    },
    size: 100

  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        "Role"
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("role")}</div>,
    size: 100

  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        "Type"
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("type")}</div>,
    size: 100

  },
  {
    accessorKey: "difficultyLevel",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const handleSort = () => column.toggleSorting(isSorted === "asc");

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          className="flex items-center gap-1"
          aria-label={`Sort by CreatedAt ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          Difficulty Level
          {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
          {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const type: "Easy" | "Medium" | "Hard" = row.getValue("difficultyLevel");
      return (
        <div className={`flex rounded-4xl max-w-[120px] justify-center items-center text-center ${type == "Easy" ? "bg-[#46c6c2]" : type == "Medium" ? "bg-[#ffb700]" : "bg-[#f63737]"}`}>
          <span className="text-center p-2 ">{row.getValue("difficultyLevel")}</span>
        </div>
      )
    },
    enableSorting: true,
    enableResizing: true,
    size: 100,
    maxSize: 100,
  },
  {
    accessorKey: "feedBack",
    header: ({ column }) => "FeedBack",
    cell: ({ row }) => <FeedBackDialog interviewtitle={row.getValue<string>("name")} feedBack={row.getValue("feedBack")} />,
  }
]

export function InterviewHistoryTable({ globalFilterValue, query }: InterviewHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  useEffect(() => {
    setGlobalFilter(globalFilterValue.trim() || "");
  }, [globalFilterValue]);


  // Normalize API data to expected table shape
  const normalizedData: InterviewHistoryType[] = (query.data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    completedAt: item.completedAt ? new Date(item.completedAt) : item.createdAt ? new Date(item.createdAt) : new Date(),
    role: item.role,
    type: item.type,
    difficultyLevel: item.difficultyLevel,
    feedBack: item.feedBack || item.feedback || "",
  }));

  const table = useReactTable({
    columns,
    data: normalizedData,
    state: {
      sorting,
      globalFilter,
      pagination
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
                    <TableHead key={header.id} style={{ width: header.getSize() }} className="p-2 bg-transparent text-left border-b-2  border-gray-400 border-dotted">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="h-full">
              {table.getRowModel().rows.map((row) => (
                <TableRow className="p-4 border-none rounded-[45px] hover:bg-[#e7e9fb]" key={row.id}>
                  {row.getVisibleCells().map((cell, i) => {
                    const isFirst = i === 0;
                    const isLast = i === row.getVisibleCells().length - 1;

                    return (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`p-4 ${isFirst ? 'rounded-l-[45px]' : ''} ${isLast ? 'rounded-r-[45px]' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
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


