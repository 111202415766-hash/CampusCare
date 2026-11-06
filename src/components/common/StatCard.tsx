import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  colorScheme: 'navy' | 'amber' | 'blue' | 'emerald';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  colorScheme,
  onClick,
}) => {
  const schemeStyles = {
    navy: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-800',
      valueColor: 'text-slate-900',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-amber-200/80 hover:border-amber-300',
      iconBg: 'bg-amber-100 text-amber-800',
      valueColor: 'text-amber-900',
    },
    blue: {
      bg: 'bg-white',
      border: 'border-blue-200/80 hover:border-blue-300',
      iconBg: 'bg-blue-100 text-blue-700',
      valueColor: 'text-blue-900',
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-emerald-200/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-800',
      valueColor: 'text-emerald-900',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 shadow-xs transition-all duration-200 ${schemeStyles.bg} ${schemeStyles.border} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${schemeStyles.valueColor}`}>
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${schemeStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
