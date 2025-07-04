import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className
}) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors",
              currentStep >= step.number
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            )}>
              {currentStep > step.number ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <step.icon className="w-6 h-6" />
              )}
            </div>
            <span className={cn(
              "text-sm mt-2 text-center",
              currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
            )}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={cn(
                "hidden md:block w-20 h-0.5 absolute top-6 transform translate-x-12",
                currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};