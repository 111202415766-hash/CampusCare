import React, { useState } from 'react';
import { X, CheckCircle2, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { ReportStatus, Report } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface StatusChangeModalProps {
  isOpen: boolean;
  report: Report;
  onClose: () => void;
  onConfirm: (newStatus: ReportStatus, notes: string) => Promise<void>;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  report,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(report.status);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const statusOptions: {
    value: ReportStatus;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      value: 'menunggu',
      title: 'Menunggu',
      desc: 'Laporan baru diterima dan dalam antrean verifikasi Sarpras.',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-200 hover:border-amber-400 peer-checked:border-amber-500 peer-checked:bg-amber-50/50',
    },
    {
      value: 'diproses',
      title: 'Diproses',
      desc: 'Teknisi ditugaskan atau suku cadang sedang dipersiapkan/dikerjakan.',
      icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-200 hover:border-blue-400 peer-checked:border-blue-500 peer-checked:bg-blue-50/50',
    },
    {
      value: 'selesai',
      title: 'Selesai',
      desc: 'Fasilitas telah diperbaiki, diuji kelayakannya, dan dapat dipakai kembali.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-200 hover:border-emerald-400 peer-checked:border-emerald-500 peer-checked:bg-emerald-50/50',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === report.status) {
      setError('Silakan pilih status yang berbeda dari status saat ini.');
      return;
    }

    if (!notes.trim()) {
      setError('Harap masukkan catatan tindakan atau alasan perubahan status.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(selectedStatus, notes);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Pembaruan Status Laporan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nomor Laporan: <span className="font-semibold text-slate-700">{report.report_number}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status comparison */}
              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-xs text-slate-500">Status Saat Ini</p>
                  <div className="mt-1">
                    <StatusBadge status={report.status} />
                  </div>
                </div>
                <div className="text-slate-400">➔</div>
                <div>
                  <p className="text-xs text-slate-500">Status Baru Terpilih</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedStatus} />
                  </div>
                </div>
              </div>

              {/* Status Radio Choices */}
              <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Pilih Status Baru
                </label>
                <div className="space-y-2.5">
                  {statusOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`relative flex cursor-pointer rounded-xl border p-3 transition-colors ${
                        selectedStatus === opt.value
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={selectedStatus === opt.value}
                        onChange={() => {
                          setSelectedStatus(opt.value);
                          setError(null);
                        }}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3 w-full">
                        <div className="mt-0.5 shrink-0">{opt.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {opt.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes input */}
              <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Catatan Tindak Lanjut / Keterangan Petugas <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Teknisi Sarpras telah melakukan penggantian suku cadang dan uji fungsi..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Catatan ini akan tersimpan dalam riwayat timeline dan dapat dibaca oleh mahasiswa pelapor.
                </p>
              </div>

              {error && (
                <div className="mt-3 flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? 'Menyimpan...' : 'Konfirmasi & Perbarui Status'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 focus:outline-hidden"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
