import React from 'react';
import { useDashboard } from './DashboardContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Sidebar() {
  const { 
    categories, 
    loadingCats, 
    selectedCat, 
    setSelectedCat, 
    setPage, 
    totalCount, 
    setShowCatModal, 
    handleDeleteCategory 
  } = useDashboard();

  return (
    <section className="lg:col-span-1 flex flex-col gap-4">
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white tracking-wide">Categorias</h3>
          <button
            onClick={() => setShowCatModal(true)}
            className="p-1.5 bg-primary-600/20 text-primary-400 rounded-lg border border-primary-500/20 hover:bg-primary-600 hover:text-white transition-all"
            title="Adicionar Categoria"
          >
            <Plus size={16} />
          </button>
        </div>

        {loadingCats ? (
          <div className="text-slate-500 text-sm text-center py-4">Carregando categorias...</div>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setSelectedCat(''); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex justify-between items-center ${
                selectedCat === '' 
                  ? 'bg-primary-600 text-white font-medium shadow-lg shadow-primary-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span>Todas</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950/40">{totalCount}</span>
            </button>

            {categories.map(cat => (
              <div key={cat.id} className="group flex items-center justify-between gap-1 w-full">
                <button
                  onClick={() => { setSelectedCat(cat.id); setPage(1); }}
                  className={`text-left px-3 py-2 rounded-xl text-sm transition-all truncate flex-1 ${
                    selectedCat === cat.id 
                      ? 'bg-primary-600 text-white font-medium shadow-lg shadow-primary-600/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all rounded-lg"
                  title="Excluir Categoria"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-slate-500 text-xs py-4 text-center">Nenhuma categoria criada ainda.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
