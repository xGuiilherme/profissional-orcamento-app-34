import React from 'react';
import { Input, type InputProps } from './input';
import { cn } from '@/lib/utils';

interface IconInputProps extends InputProps {
  icon: React.ElementType;
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon: Icon, className, ...props }, ref) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input ref={ref} className={cn('pl-10', className)} {...props} />
    </div>
  )
);
IconInput.displayName = 'IconInput';