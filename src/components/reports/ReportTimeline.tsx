import React from 'react';
import { CheckCircle2, Clock, RefreshCw, UserCheck } from 'lucide-react';
import { StatusHistory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ReportTimelineProps {
  history: StatusHistory[];
}

export const ReportTimeline: React.FC<ReportTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">Belum ada riwayat aktivitas.</p>
    );
  }

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date) + ' WIB';
    } catch {
      return isoString;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selesai':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'diproses':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'menunggu':
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((item, itemIdx) => {
          const isLast = itemIdx === history.length - 1;

          return (
            <li key={item.id || itemIdx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center ring-4 ring-white shadow-xs">
                      {getStatusIcon(item.new_status)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.new_status} size="sm" />
                        <span className="text-xs font-semibold text-slate-700">
                          {item.changed_by.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {item.changed_by.role === 'admin' ? 'Staf Sarpras' : 'Pelapor'}
                        </span>
                      </div>
                      <time className="text-xs text-slate-400">
                        {formatDateTime(item.created_at)}
                      </time>
                    </div>

                    <div className="mt-2 text-sm text-slate-600 bg-slate-50/80 rounded-lg p-3 border border-slate-100">
                      <p className="leading-relaxed">{item.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
