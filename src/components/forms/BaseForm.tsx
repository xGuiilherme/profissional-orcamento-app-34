import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BaseFormProps {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

export const BaseForm: React.FC<BaseFormProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  onSubmit,
  className,
  actions,
  isLoading = false
}) => {
  return (
    <Card className={cn("w-full", className)}>
      {(title || subtitle) && (
        <CardHeader>
          {title && (
            <CardTitle className="flex items-center">
              {Icon && <Icon className="w-5 h-5 mr-2" />}
              {title}
            </CardTitle>
          )}
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          {actions && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {actions}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};