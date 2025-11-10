import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const pastelCard = 'rounded-2xl border border-white/60 shadow-sm bg-white/70 backdrop-blur';

export default function YearCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const [selectedDate, setSelectedDate] = useState(startOfDay(now));
  const [reminders, setReminders] = useState(() => {
    try {
      const raw = localStorage.getItem('reminders');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  const timersRef = useRef([]);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    // Request notification permission early
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Clear existing timeouts
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Schedule upcoming reminders for today and future
    const nowTs = Date.now();
    Object.entries(reminders).forEach(([dateKey, items]) => {
      items.forEach((r) => {
        if (!r.time) return;
        const due = new Date(`${dateKey}T${r.time}:00`);
        const delay = due.getTime() - nowTs;
        if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 30) {
          const t = setTimeout(() => {
            triggerNotify(r.title, due);
          }, delay);
          timersRef.current.push(t);
        }
      });
    });
  }, [reminders]);

  function triggerNotify(t, due) {
    const body = `Pengingat pada ${due.toLocaleString()}`;
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(t || 'Pengingat', { body });
      } catch (e) {
        // Fallback below
        // eslint-disable-next-line no-alert
        alert(`${t || 'Pengingat'}\n${body}`);
      }
    } else {
      // eslint-disable-next-line no-alert
      alert(`${t || 'Pengingat'}\n${body}`);
    }
  }

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  function getDaysInMonth(y, mIndex) {
    return new Date(y, mIndex + 1, 0).getDate();
  }

  function firstDayOfMonth(y, mIndex) {
    return new Date(y, mIndex, 1).getDay(); // 0 Sun - 6 Sat
  }

  const selectedKey = formatDateKey(selectedDate);
  const dayReminders = reminders[selectedKey] || [];

  function addReminder(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const key = selectedKey;
    const newItem = { id: crypto.randomUUID(), title: title.trim(), time };
    setReminders((prev) => {
      const list = prev[key] ? [...prev[key], newItem] : [newItem];
      return { ...prev, [key]: list };
    });
    setTitle('');
    setTime('');
  }

  function removeReminder(id) {
    const key = selectedKey;
    setReminders((prev) => {
      const list = (prev[key] || []).filter((r) => r.id !== id);
      const copy = { ...prev };
      if (list.length) copy[key] = list; else delete copy[key];
      return copy;
    });
  }

  function DayCell({ day, monthIndex }) {
    if (day <= 0) return <div className="p-2" />;
    const d = new Date(year, monthIndex, day);
    const key = formatDateKey(d);
    const isToday = formatDateKey(new Date()) === key;
    const isSelected = selectedKey === key;
    const hasReminder = (reminders[key] || []).length > 0;
    return (
      <button
        onClick={() => setSelectedDate(d)}
        className={`relative p-2 rounded-lg border text-sm transition-colors w-full h-10 flex items-center justify-center
          ${isSelected ? 'bg-pink-100/80 border-pink-200 text-pink-900' : 'bg-white/70 border-white/70 hover:bg-pink-50'}
        `}
        aria-label={`Pilih tanggal ${d.toDateString()}`}
      >
        <span className={`${isToday ? 'font-semibold underline decoration-wavy decoration-pink-400' : ''}`}>{day}</span>
        {hasReminder && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-400" />
        )}
      </button>
    );
  }

  function Month({ monthIndex }) {
    const days = getDaysInMonth(year, monthIndex);
    const first = firstDayOfMonth(year, monthIndex);
    const leading = (first + 6) % 7; // make Monday-first layout if desired; keep Sunday-first by using 'first'
    const blanks = Array.from({ length: first }, () => 0);
    const cells = [...blanks, ...Array.from({ length: days }, (_, i) => i + 1)];

    const monthName = new Date(year, monthIndex).toLocaleString('id-ID', { month: 'long' });

    return (
      <div className={`${pastelCard} p-3`}> 
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon size={16} className="text-pink-500" />
          <h3 className="text-sm font-semibold text-pink-700 capitalize">{monthName}</h3>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[11px] text-pink-700/80 mb-1">
          {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d) => (
            <div key={d} className="text-center py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, idx) => (
            <DayCell key={idx} day={c} monthIndex={monthIndex} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-pink-700">Kalender {year}</h2>
        <div className="flex items-center gap-2 text-pink-600">
          <Bell size={18} />
          <span className="text-sm">Notifikasi pengingat</span>
        </div>
      </header>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {months.map((m) => (
            <Month key={m} monthIndex={m} />
          ))}
        </div>
        <div className={`${pastelCard} p-4 h-fit sticky top-4`}>
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="text-pink-500" />
            <div>
              <p className="text-xs text-pink-500">Tanggal terpilih</p>
              <p className="font-semibold text-pink-700">{selectedDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <form onSubmit={addReminder} className="space-y-2 mb-4">
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900 placeholder-pink-400"
                placeholder="Judul pengingat"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="time"
                className="w-32 px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transition text-sm">
              <Plus size={16} /> Tambah Pengingat
            </button>
          </form>

          <div>
            <h4 className="text-sm font-semibold text-pink-700 mb-2">Daftar Pengingat</h4>
            {dayReminders.length === 0 ? (
              <p className="text-sm text-pink-500">Belum ada pengingat untuk tanggal ini.</p>
            ) : (
              <ul className="space-y-2">
                {dayReminders.map((r) => (
                  <li key={r.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 border border-pink-100">
                    <div>
                      <p className="text-pink-800 font-medium">{r.title}</p>
                      {r.time && <p className="text-xs text-pink-500">Pukul {r.time}</p>}
                    </div>
                    <button
                      onClick={() => removeReminder(r.id)}
                      className="text-pink-500 hover:text-pink-700"
                      aria-label="Hapus pengingat"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
