import { useState } from 'react';
import { initialData } from './data/initialData';
import { BillTable } from './components/BillTable';
import { BillForm } from './components/BillForm';
import { PaydayForm } from './components/PaydayForm';
import { useCalculations } from './hooks/useCalculations';
import type { Entry, Bill, Payday } from './types';
import { Plus } from 'lucide-react';

function App() {
  const [data, setData] = useState<Entry[]>(initialData);
  const [isBillFormOpen, setIsBillFormOpen] = useState(false);
  const [isPaydayFormOpen, setIsPaydayFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const calculatedData = useCalculations(data);

  const handleTogglePaid = (id: string) => {
    setData(prev => prev.map(entry => {
      if (entry.id === id && entry.type === 'bill') {
        return { ...entry, paid: !entry.paid };
      }
      return entry;
    }));
  };

  const handleAddBill = (billData: Omit<Bill, 'id' | 'type' | 'paid'>) => {
    const newBill: Bill = {
      ...billData,
      id: crypto.randomUUID(),
      type: 'bill',
      paid: false,
      amounts: billData.amounts
    };
    setData(prev => [...prev, newBill]);
  };

  const handleAddPayday = (paydayData: Omit<Payday, 'id' | 'type'>) => {
    const newPayday: Payday = {
      ...paydayData,
      id: crypto.randomUUID(),
      type: 'payday',
      balances: paydayData.balances
    };
    setData(prev => [...prev, newPayday]);
  };

  const handleEditBill = (billData: Omit<Bill, 'id' | 'type' | 'paid'>) => {
    if (!editingId) return;
    setData(prev => prev.map(entry => {
      if (entry.id === editingId) {
        return {
          ...entry,
          ...billData
        } as Bill;
      }
      return entry;
    }));
  };

  const handleEditPayday = (paydayData: Omit<Payday, 'id' | 'type'>) => {
    if (!editingId) return;
    setData(prev => prev.map(entry => {
      if (entry.id === editingId) {
        return {
          ...entry,
          ...paydayData
        } as Payday;
      }
      return entry;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setData(prev => prev.filter(e => e.id !== id));
    }
  };

  const openEdit = (entry: Entry) => {
    setEditingId(entry.id);
    if (entry.type === 'bill') {
      setIsBillFormOpen(true);
    } else {
      setIsPaydayFormOpen(true);
    }
  };

  const closeForm = () => {
    setIsBillFormOpen(false);
    setIsPaydayFormOpen(false);
    setEditingId(null);
  };

  const editingEntry = editingId ? data.find(e => e.id === editingId) : undefined;

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 text-neutral-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
              Bill Tracker
            </h1>
            <p className="text-neutral-400">Manage your finances with precision.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-sm text-neutral-400 flex items-center h-10">
              Total Entries: <span className="text-emerald-400 font-mono font-bold ml-2">{data.length}</span>
            </div>
            <button
              onClick={() => setIsPaydayFormOpen(true)}
              className="bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors h-10"
            >
              <Plus size={20} />
              Add Payday
            </button>
            <button
              onClick={() => setIsBillFormOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-colors h-10"
            >
              <Plus size={20} />
              Add Bill
            </button>
          </div>
        </header>

        <main>
          <BillTable
            data={calculatedData}
            onTogglePaid={handleTogglePaid}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </main>

        {isBillFormOpen && (
          <BillForm
            initialData={editingEntry as Bill}
            onSave={editingId ? handleEditBill : handleAddBill}
            onClose={closeForm}
          />
        )}

        {isPaydayFormOpen && (
          <PaydayForm
            initialData={editingEntry as Payday}
            onSave={editingId ? handleEditPayday : handleAddPayday}
            onClose={closeForm}
          />
        )}
      </div>
    </div>
  )
}

export default App
