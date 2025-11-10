import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

const pastelCard = 'rounded-2xl border border-white/60 shadow-sm bg-white/70 backdrop-blur';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(() => {
    try {
      const raw = localStorage.getItem('photos');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  function onFiles(files) {
    const readers = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ id: crypto.randomUUID(), src: reader.result });
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((res) => setPhotos((prev) => [...res, ...prev]));
  }

  function remove(id) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section className={`${pastelCard} p-4 space-y-3`}>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImagePlus className="text-pink-500" />
          <h3 className="font-semibold text-pink-700">Galeri Foto</h3>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onFiles(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transition text-sm"
          >
            Tambah Foto
          </button>
        </div>
      </header>

      {photos.length === 0 ? (
        <p className="text-sm text-pink-500">Belum ada foto. Unggah untuk mulai.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((p) => (
            <figure key={p.id} className="relative group overflow-hidden rounded-xl border border-pink-100 bg-white/60">
              <img src={p.src} alt="Foto" className="aspect-square object-cover w-full h-full" />
              <button
                onClick={() => remove(p.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 text-pink-600 opacity-0 group-hover:opacity-100 transition"
                aria-label="Hapus foto"
              >
                <X size={16} />
              </button>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
