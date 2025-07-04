import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionComponent?: React.ReactNode;
}

export const PageHeader = ({ title, description, actionComponent }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
    <div className="mt-4 sm:mt-0">
      {actionComponent}
    </div>
  </div>
);