import React, { useState } from 'react';
import { Eye, X, Image as ImageIcon } from 'lucide-react';
import { ReportPhoto } from '../../types';

interface PhotoGalleryProps {
  photos: ReportPhoto[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<ReportPhoto | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
        <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-600">Tidak ada foto terlampir</p>
        <p className="text-xs text-slate-400 mt-0.5">Pelapor tidak menyertakan foto dokumentasi kerusakan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-video shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <img
              src={photo.photo_url}
              alt={photo.caption || 'Foto kerusakan fasilitas'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
              <span className="inline-flex items-center gap-1 text-xs font-medium">
                <Eye className="w-3.5 h-3.5" /> Lihat Ukuran Penuh
              </span>
              {photo.caption && (
                <p className="text-[11px] truncate opacity-90">{photo.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-white">
              <span className="text-sm font-medium">
                {selectedPhoto.caption || 'Foto Dokumentasi Kerusakan Fasilitas'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-black/60 p-2">
              <img
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption || 'Foto Kerusakan'}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
