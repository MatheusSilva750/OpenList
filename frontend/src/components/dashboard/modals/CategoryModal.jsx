import React from 'react';
import { useDashboard } from '../DashboardContext';
import { X } from 'lucide-react';

export default function CategoryModal() {
  const { 
    showCatModal, 
    setShowCatModal, 
    newCatName, 
    setNewCatName, 
    handleCreateCategory 
  } = useDashboard();

  if (!showCatModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
        <button 
          onClick={() => setShowCatModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>
        <h3 className="text-xl font-bold text-white mb-6">Criar Categoria</h3>
        
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Nome da Categoria</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Trabalho, Pessoal, Fitness..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setShowCatModal(false)}
              className="px-4 py-2 border border-slate-800 text-sm font-semibold rounded-xl text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-sm font-semibold rounded-xl text-white shadow-lg"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
