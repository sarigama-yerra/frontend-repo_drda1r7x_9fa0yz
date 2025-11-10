import React, { useEffect, useState } from 'react';
import { NotebookPen, Plus, Trash2 } from 'lucide-react';

const pastelCard = 'rounded-2xl border border-white/60 shadow-sm bg-white/70 backdrop-blur';

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    try {
      const raw = localStorage.getItem('notes');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setNotes((prev) => [{ id: crypto.randomUUID(), text: text.trim(), createdAt: Date.now() }, ...prev]);
    setText('');
  }

  function removeNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <section className={`${pastelCard} p-4 space-y-3`}>
      <header className="flex items-center gap-2">
        <NotebookPen className="text-pink-500" />
        <h3 className="font-semibold text-pink-700">Catatan</h3>
      </header>

      <form onSubmit={addNote} className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900 placeholder-pink-400"
          placeholder="Tulis catatan..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transition text-sm">
          <Plus size={16} /> Simpan
        </button>
      </form>

      <ul className="space-y-2 max-h-64 overflow-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-sm text-pink-500">Belum ada catatan.</p>
        ) : (
          notes.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-3 px-3 py-2 rounded-xl bg-white/70 border border-pink-100">
              <div>
                <p className="text-pink-800 whitespace-pre-wrap">{n.text}</p>
                <p className="text-[11px] text-pink-500 mt-1">{new Date(n.createdAt).toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => removeNote(n.id)} className="text-pink-500 hover:text-pink-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
