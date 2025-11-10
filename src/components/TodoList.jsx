import React, { useEffect, useState } from 'react';
import { CheckSquare, Plus, Square, Trash2 } from 'lucide-react';

const pastelCard = 'rounded-2xl border border-white/60 shadow-sm bg-white/70 backdrop-blur';

export default function TodoList() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('todos');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  function addItem(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setItems((prev) => [{ id: crypto.randomUUID(), text: text.trim(), done: false, createdAt: Date.now() }, ...prev]);
    setText('');
  }

  function toggle(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function remove(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <section className={`${pastelCard} p-4 space-y-3`}>
      <header className="flex items-center gap-2">
        <CheckSquare className="text-pink-500" />
        <h3 className="font-semibold text-pink-700">Checklist To-Do</h3>
      </header>

      <form onSubmit={addItem} className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900 placeholder-pink-400"
          placeholder="Tambah tugas..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transition text-sm">
          <Plus size={16} /> Tambah
        </button>
      </form>

      <ul className="space-y-2 max-h-64 overflow-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-pink-500">Belum ada tugas.</p>
        ) : (
          items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/70 border border-pink-100">
              <button onClick={() => toggle(i.id)} className={`text-pink-600`}
                aria-label={i.done ? 'Tandai belum selesai' : 'Tandai selesai'}
              >
                {i.done ? <CheckSquare /> : <Square />}
              </button>
              <div className="flex-1">
                <p className={`text-pink-800 ${i.done ? 'line-through opacity-60' : ''}`}>{i.text}</p>
                <p className="text-[11px] text-pink-500">{new Date(i.createdAt).toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => remove(i.id)} className="text-pink-500 hover:text-pink-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
