import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTheme } from "next-themes";
import { isCustomColumn, TableComponentProps } from "@/app/types/tableTypes";
import { Filter } from "./Filter";

export const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  columnVisibility,
  setColumnVisibility,
  filters,
  onFiltersChange,
  sorting,
  onSortingChange,
}) => {
  const table = useReactTable({
    columns,
    data,
    state: {
      columnVisibility,
      columnFilters: filters,
      sorting,
    },
    onColumnFiltersChange: onFiltersChange,
    onSortingChange: onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full ${
          isDark ? "bg-neutral-900" : "bg-white"
        } border ${isDark ? "border-neutral-700" : "border-gray-200"}`}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className={`${isDark ? "bg-neutral-900" : "bg-gray-100"}`}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-6 py-3 text-center font-medium ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }  tracking-wider border-b border-r ${
                    isDark ? "border-neutral-600" : "border-gray-200"
                  } cursor-pointer`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center">
                      {typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : (header.column.columnDef.header as string)}
                      {header.column.getIsSorted() && (
                        <span className="ml-1">
                          {header.column.getIsSorted() === "asc" ? "🔼" : "🔽"}
                        </span>
                      )}
                    </div>
                    {isCustomColumn(header.column) && (
                      <Filter column={header.column} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`${isDark ? "bg-neutral-900" : "bg-white"} ${
                  isDark ? "odd:bg-zinc-800" : "odd:bg-gray-50"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } border-b border-r ${
                      isDark ? "border-neutral-600" : "border-gray-200"
                    } text-center`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`px-6 py-4 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } border-b border-r ${
                  isDark ? "border-neutral-600" : "border-gray-200"
                } text-center`}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
