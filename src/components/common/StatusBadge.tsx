import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ReportStatus } from '../../types';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const configs: Record<
    ReportStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    menunggu: {
      label: 'Menunggu',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
    },
    diproses: {
      label: 'Diproses',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin-slow" />,
    },
    selesai: {
      label: 'Selesai',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
  };

  const config = configs[status] || configs.menunggu;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
