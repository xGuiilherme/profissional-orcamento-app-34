import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'bg-blue-500',
  className
}) => {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <span className={cn("text-sm font-medium", changeColorClass)}>
                  {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn("p-3 rounded-full", iconColor)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};