import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const pastelCard = 'rounded-2xl border border-white/60 shadow-sm bg-white/70 backdrop-blur';

export default function FinanceTracker() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('finance');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('finance', JSON.stringify(items));
  }, [items]);

  function addItem(e) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!desc.trim() || isNaN(amt) || amt <= 0) return;
    setItems((prev) => [
      { id: crypto.randomUUID(), type, amount: amt, desc: desc.trim(), date: Date.now() },
      ...prev,
    ]);
    setAmount('');
    setDesc('');
  }

  const { income, expense, balance } = useMemo(() => {
    const income = items.filter((i) => i.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = items.filter((i) => i.type === 'expense').reduce((a, b) => a + b.amount, 0);
    return { income, expense, balance: income - expense };
  }, [items]);

  return (
    <section className={`${pastelCard} p-4 space-y-4`}>
      <header className="flex items-center justify-between">
        <h3 className="font-semibold text-pink-700">Pengeluaran & Pemasukan</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1 text-green-600"><ArrowUpCircle size={16}/> {income.toLocaleString('id-ID')}</span>
          <span className="inline-flex items-center gap-1 text-red-500"><ArrowDownCircle size={16}/> {expense.toLocaleString('id-ID')}</span>
          <span className="px-2 py-1 rounded-lg bg-pink-100 text-pink-700 font-medium">Saldo: {balance.toLocaleString('id-ID')}</span>
        </div>
      </header>

      <form onSubmit={addItem} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900">
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Jumlah"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900 placeholder-pink-400"
        />
        <input
          placeholder="Deskripsi"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="px-3 py-2 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900 placeholder-pink-400"
        />
        <button className="px-3 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transition text-sm">Tambah</button>
      </form>

      <ul className="space-y-2 max-h-64 overflow-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-pink-500">Belum ada transaksi.</p>
        ) : (
          items.map((i) => (
            <li key={i.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 border border-pink-100">
              <div className="flex items-center gap-2">
                {i.type === 'income' ? (
                  <ArrowUpCircle className="text-green-600" size={18} />
                ) : (
                  <ArrowDownCircle className="text-red-500" size={18} />
                )}
                <div>
                  <p className="text-pink-800 font-medium">{i.desc}</p>
                  <p className="text-[11px] text-pink-500">{new Date(i.date).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <p className={`${i.type === 'income' ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                {i.amount.toLocaleString('id-ID')}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
