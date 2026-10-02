import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto border border-slate-200 rounded-sm">
      <table
        className={cn(
          "w-full caption-bottom text-xs text-left text-slate-700 border-collapse",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-slate-100 bg-white", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  isHeader,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { isHeader?: boolean }) {
  return (
    <tr
      className={cn(
        "transition-colors",
        !isHeader && "hover:bg-slate-50/80 data-[state=selected]:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  sortable,
  onSort,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  onSort?: () => void;
}) {
  return (
    <th
      className={cn(
        "h-9 px-3 text-left align-middle font-bold text-slate-700 select-none whitespace-nowrap",
        sortable && "cursor-pointer hover:bg-slate-100 hover:text-slate-900",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && <ArrowUpDown className="w-3 h-3 text-slate-400" />}
      </div>
    </th>
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "p-3 align-middle font-normal whitespace-nowrap text-slate-800",
        className
      )}
      {...props}
    />
  );
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <span>Showing</span>
        <span className="font-semibold text-slate-800 font-tabular">{startItem}</span>
        <span>to</span>
        <span className="font-semibold text-slate-800 font-tabular">{endItem}</span>
        <span>of</span>
        <span className="font-semibold text-slate-800 font-tabular">{totalItems}</span>
        <span>entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="px-2 py-0.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
