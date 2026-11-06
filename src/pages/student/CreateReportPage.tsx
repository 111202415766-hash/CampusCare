import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Camera,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { PriorityLevel } from '../../types';
import { SAMPLE_FACILITY_PHOTOS } from '../../data/mockData';

interface PhotoAttachment {
  url: string;
  caption?: string;
}

export const CreateReportPage: React.FC = () => {
  const { categories, locations, createReport } = useReports();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('sedang');
  const [photos, setPhotos] = useState<PhotoAttachment[]>([]);
  const [captionInput, setCaptionInput] = useState('');

  // Validation & Submission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active categories & locations
  const activeCategories = categories.filter((c) => c.is_active);
  const activeLocations = locations.filter((l) => l.is_active);

  // File upload handler (converts to base64 DataURL for immediate browser preview & storage)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} melebihi batas ukuran 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [
            ...prev,
            {
              url: reader.result as string,
              caption: captionInput.trim() || file.name,
            },
          ]);
          setCaptionInput('');
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add sample photo helper
  const handleAddSamplePhoto = (sample: (typeof SAMPLE_FACILITY_PHOTOS)[0]) => {
    // Avoid duplicates
    if (photos.some((p) => p.url === sample.url)) return;
    setPhotos((prev) => [
      ...prev,
      {
        url: sample.url,
        caption: `Foto Contoh: ${sample.title}`,
      },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Judul laporan kerusakan wajib diisi.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Judul laporan minimal 5 karakter.';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Pilih kategori kerusakan fasilitas.';
    }

    if (!locationId) {
      newErrors.locationId = 'Pilih gedung / lokasi fasilitas kampus.';
    }

    if (!specificLocation.trim()) {
      newErrors.specificLocation = 'Keterangan letak spesifik wajib diisi (misal: Ruang Lab D.2.B, deret 3).';
    }

    if (!description.trim()) {
      newErrors.description = 'Deskripsi kerusakan fasilitas wajib diisi.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Berikan deskripsi detail minimal 15 karakter.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      const newReport = await createReport({
        title: title.trim(),
        category_id: categoryId,
        location_id: locationId,
        specific_location: specificLocation.trim(),
        description: description.trim(),
        priority,
        photos,
      });

      setSuccessMessage(`Laporan dengan nomor ${newReport.report_number} berhasil dibuat! Mengalihkan ke detail laporan...`);
      setTimeout(() => {
        navigate(`/student/reports/${newReport.id}`);
      }, 1200);
    } catch (err: unknown) {
      setErrors({ form: err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan laporan.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header breadcrumb & navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <span className="text-xs text-slate-400">
          Formulir Pengaduan Sarana & Prasarana
        </span>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="pb-6 border-b border-slate-100 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Buat Laporan Kerusakan Fasilitas Kampus
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Isi formulir berikut dengan lengkap untuk mempermudah tim Biro Sarana dan Prasarana melakukan verifikasi dan perbaikan.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errors.form && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-800 border border-rose-200">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Judul Kerusakan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: AC Ruang D.2.B Meneteskan Air dan Kurang Dingin"
              className={`w-full rounded-xl border p-3 text-sm focus:outline-hidden focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kategori Kerusakan <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`w-full rounded-xl border p-3 text-sm focus:outline-hidden focus:ring-2 ${
                  errors.categoryId
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              >
                <option value="">-- Pilih Kategori Kerusakan --</option>
                {activeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.categoryId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tingkat Urgensi / Prioritas
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['rendah', 'sedang', 'tinggi'] as PriorityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      priority === lvl
                        ? lvl === 'tinggi'
                          ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                          : lvl === 'sedang'
                          ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs'
                          : 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Specific Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Gedung & Lantai <span className="text-rose-500">*</span>
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className={`w-full rounded-xl border p-3 text-sm focus:outline-hidden focus:ring-2 ${
                  errors.locationId
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              >
                <option value="">-- Pilih Lokasi Gedung --</option>
                {activeLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.building_name} - {l.floor}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.locationId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detail Ruang / Titik Spesifik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="Contoh: Ruang D.2.B deretan PC nomor 14"
                className={`w-full rounded-xl border p-3 text-sm focus:outline-hidden focus:ring-2 ${
                  errors.specificLocation
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.specificLocation && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.specificLocation}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Deskripsi Kerusakan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara rinci kondisi fasilitas yang rusak, gejala yang terjadi, dan dampaknya terhadap kegiatan perkuliahan..."
              className={`w-full rounded-xl border p-3 text-sm focus:outline-hidden focus:ring-2 ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Photo Upload & Preview Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Foto Bukti Dokumentasi Kerusakan
              </label>
              <span className="text-xs text-slate-400">
                Maksimal 5MB (PNG, JPG, JPEG)
              </span>
            </div>

            {/* Upload Zone */}
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center hover:bg-slate-50 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="sr-only"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Klik untuk memilih file foto atau tarik ke sini
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Format gambar JPG, PNG dari kamera HP atau galeri
                </p>
              </label>
            </div>

            {/* Quick Demo Sample Photos for 1-Click Simulation */}
            <div className="mt-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900">
                  Foto Contoh Cepat untuk Pengujian:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_FACILITY_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSamplePhoto(sample)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>+ {sample.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Previews */}
            {photos.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Foto Terlampir ({photos.length} gambar):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-xs"
                    >
                      <img
                        src={photo.url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1.5 right-1.5 rounded-full bg-slate-900/80 p-1 text-white hover:bg-rose-600 transition-colors shadow-xs"
                        title="Hapus foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-2 py-1 text-[10px] text-white truncate">
                        {photo.caption || `Foto #${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 transition-all"
            >
              {isSubmitting ? 'Mengirimkan Laporan...' : 'Kirim Laporan Kerusakan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
