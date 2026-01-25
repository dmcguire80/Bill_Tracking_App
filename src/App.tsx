import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BillTable } from './components/BillTable';
import { BillForm } from './components/BillForm';
import { PaydayForm } from './components/PaydayForm';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { SetupWizard } from './components/SetupWizard';
import { useCalculations } from './hooks/useCalculations';
import { useData } from './context/DataContext';
import type { Bill, Payday, Entry } from './types';
import { Plus } from 'lucide-react';
import { uuid } from './utils/uuid';

import { ManageBills } from './pages/ManageBills';
import { ManageAccounts } from './pages/ManageAccounts';
import { ManagePaydays } from './pages/ManagePaydays';
import { DataManagement } from './pages/DataManagement';
import { Analytics } from './pages/Analytics';

function Dashboard() {
  const { entries, accounts, addEntry, updateEntry, deleteEntry } = useData();
  const [isBillFormOpen, setIsBillFormOpen] = useState(false);
  const [isPaydayFormOpen, setIsPaydayFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const calculatedData = useCalculations(entries, accounts);

  const handleTogglePaid = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry && entry.type === 'bill') {
      updateEntry({ ...entry, paid: !entry.paid });
    }
  };

  const handleAddBill = (billData: Omit<Bill, 'id' | 'type' | 'paid'>) => {
    const newBill: Bill = {
      ...billData,
      id: uuid(),
      type: 'bill',
      paid: false,
      amounts: billData.amounts
    };
    addEntry(newBill);
  };

  const handleAddPayday = (paydayData: Omit<Payday, 'id' | 'type'>) => {
    const newPayday: Payday = {
      ...paydayData,
      id: uuid(),
      type: 'payday',
      balances: paydayData.balances
    };
    addEntry(newPayday);
  };

  const handleEditBill = (billData: Omit<Bill, 'id' | 'type' | 'paid'>) => {
    if (!editingId) return;
    const entry = entries.find(e => e.id === editingId);
    if (entry && entry.type === 'bill') {
      updateEntry({ ...entry, ...billData });
      setEditingId(null); // Close form after save
      setIsBillFormOpen(false);
    }
  };

  const handleEditPayday = (paydayData: Omit<Payday, 'id' | 'type'>) => {
    if (!editingId) return;
    const entry = entries.find(e => e.id === editingId);
    if (entry && entry.type === 'payday') {
      updateEntry({ ...entry, ...paydayData });
      setEditingId(null);
      setIsPaydayFormOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
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

  const editingEntry = editingId ? entries.find(e => e.id === editingId) : undefined;

  return (
    <>
      <Navigation />

      <header className="flex justify-between items-end border-b border-white/10 pb-4 mb-4 md:pb-6 md:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white hidden sm:block">Dashboard</h2>
          <p className="text-neutral-400 hidden sm:block">Overview of your bills and payments.</p>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <button
            onClick={() => setIsPaydayFormOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors h-10 shrink-0"
            title="Add Deposit"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Deposit</span>
          </button>
          <button
            onClick={() => setIsBillFormOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-colors h-10 shrink-0"
            title="One-time Payment"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">One-time Payment</span>
          </button>
        </div>
      </header>

      <BillTable
        data={calculatedData}
        onTogglePaid={handleTogglePaid}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

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
    </>
  );
}


function App() {
  const { accounts, loading, importData } = useData();

  const handleSetupComplete = (data: any) => {
    importData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-500/80 font-mono text-sm animate-pulse">Syncing data...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={
          accounts.length > 0 ? <Navigate to="/" replace /> : <SetupWizard onComplete={handleSetupComplete} />
        } />

        <Route path="/" element={
          accounts.length === 0 ? <Navigate to="/setup" replace /> : (
            <Layout>
              <Dashboard />
            </Layout>
          )
        } />

        <Route path="/analytics" element={
          accounts.length === 0 ? <Navigate to="/setup" replace /> : (
            <Layout>
              <Analytics />
            </Layout>
          )
        } />

        <Route path="/settings/*" element={
          accounts.length === 0 ? <Navigate to="/setup" replace /> : (
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="bills" replace />} />
                <Route path="bills" element={<ManageBills />} />
                <Route path="accounts" element={<ManageAccounts />} />
                <Route path="paydays" element={<ManagePaydays />} />
                <Route path="data" element={<DataManagement />} />
              </Routes>
            </Layout>
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
