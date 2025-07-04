import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: any) => void;
  variant?: 'default' | 'destructive';
}

interface DataTableProps {
  title?: string;
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  headerActions?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columns,
  actions = [],
  headerActions,
  emptyMessage = "Nenhum item encontrado",
  className
}) => {
  const renderCellValue = (column: TableColumn, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    return value;
  };

  return (
    <Card className={className}>
      {(title || headerActions) && (
        <CardHeader className="flex flex-row items-center justify-between">
          {title && <CardTitle>{title}</CardTitle>}
          {headerActions}
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "py-3 px-2 font-medium text-gray-600",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right",
                      column.align !== 'center' && column.align !== 'right' && "text-left"
                    )}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "py-3 px-2",
                        column.align === 'center' && "text-center",
                        column.align === 'right' && "text-right"
                      )}
                    >
                      {renderCellValue(column, row)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="py-3 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={action.variant === 'destructive' ? 'text-red-600' : ''}
                            >
                              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};