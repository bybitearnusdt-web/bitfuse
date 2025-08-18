import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface ResponsiveTableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface ResponsiveTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  dataLabel?: string;
}

const ResponsiveTable = React.forwardRef<HTMLTableElement, ResponsiveTableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm responsive-table', className)}
        {...props}
      >
        {children}
      </table>
      
      {/* Mobile card list - hidden by default, shown on mobile via CSS */}
      <div className="mobile-card-list hidden space-y-4">
        {children}
      </div>
    </div>
  )
);
ResponsiveTable.displayName = 'ResponsiveTable';

const ResponsiveTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
ResponsiveTableHeader.displayName = 'ResponsiveTableHeader';

const ResponsiveTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
ResponsiveTableBody.displayName = 'ResponsiveTableBody';

const ResponsiveTableRow = React.forwardRef<HTMLTableRowElement, ResponsiveTableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
);
ResponsiveTableRow.displayName = 'ResponsiveTableRow';

const ResponsiveTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
ResponsiveTableHead.displayName = 'ResponsiveTableHead';

const ResponsiveTableCell = React.forwardRef<HTMLTableCellElement, ResponsiveTableCellProps>(
  ({ className, dataLabel, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      data-label={dataLabel}
      {...props}
    >
      {children}
    </td>
  )
);
ResponsiveTableCell.displayName = 'ResponsiveTableCell';

// Mobile Card component for table rows
interface MobileTableCardProps {
  children: React.ReactNode;
  className?: string;
}

const MobileTableCard = React.forwardRef<HTMLDivElement, MobileTableCardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3 block md:hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
MobileTableCard.displayName = 'MobileTableCard';

export {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableHead,
  ResponsiveTableRow,
  ResponsiveTableCell,
  MobileTableCard,
};