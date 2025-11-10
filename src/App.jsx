import React from 'react';
import YearCalendar from './components/YearCalendar';
import Notes from './components/Notes';
import FinanceTracker from './components/FinanceTracker';
import PhotoGallery from './components/PhotoGallery';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-violet-50 text-pink-900">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-700">Planner Pastel 2025</h1>
          <p className="text-pink-600">Kalender, pengingat, catatan, keuangan, galeri foto, dan to-do list dalam satu tempat.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <YearCalendar />
            <FinanceTracker />
            <PhotoGallery />
          </div>
          <div className="space-y-6">
            <Notes />
            <TodoList />
          </div>
        </div>

        <footer className="text-center text-xs text-pink-500 pt-6">
          Dibuat dengan nuansa warna pastel. Data tersimpan di peramban Anda.
        </footer>
      </div>
    </div>
  );
}
