import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { PriorityLevel } from '../../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs: Record<
    PriorityLevel,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    tinggi: {
      label: 'Tinggi',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <AlertCircle className="w-3 h-3" />,
    },
    sedang: {
      label: 'Sedang',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    rendah: {
      label: 'Rendah',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: <Info className="w-3 h-3" />,
    },
  };

  const config = configs[priority] || configs.sedang;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-0.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
