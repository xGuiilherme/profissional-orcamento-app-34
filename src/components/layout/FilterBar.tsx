import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { SelectInput } from '@/components/forms/FormFields';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterConfig[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  className
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Inputs */}
          {filters.map((filter) => (
            <div key={filter.key}>
              {filter.type === 'select' ? (
                <SelectInput
                  label=""
                  name={filter.key}
                  value={filterValues[filter.key] || ''}
                  onChange={(value) => onFilterChange(filter.key, value)}
                  options={filter.options || []}
                  placeholder={filter.placeholder || `Filtrar por ${filter.label.toLowerCase()}`}
                />
              ) : (
                <Input
                  placeholder={filter.placeholder || filter.label}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* Clear Filters Button */}
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters} className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};