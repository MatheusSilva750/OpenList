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
    <section className="md:col-span-1 flex flex-col gap-4">
      <div className="glass-card p-4 md:p-5 rounded-2xl border border-slate-800 flex flex-col gap-4 overflow-hidden">
        <div className="flex justify-between items-center px-1 md:px-0">
          <h3 className="font-semibold text-white tracking-wide">Categorias</h3>
          <button
            onClick={() => setShowCatModal(true)}
            className="p-1.5 bg-primary-600/20 text-primary-400 rounded-lg border border-primary-500/20 hover:bg-primary-600 hover:text-white transition-all flex-shrink-0"
            title="Adicionar Categoria"
          >
            <Plus size={16} />
          </button>
        </div>

        {loadingCats ? (
          <div className="text-slate-500 text-sm text-center py-4">Carregando categorias...</div>
        ) : (
          <div className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => { setSelectedCat(''); setPage(1); }}
              className={`flex-shrink-0 md:w-full text-left px-4 md:px-3 py-2 rounded-xl text-sm transition-all flex justify-between items-center gap-2 ${
                selectedCat === '' 
                  ? 'bg-primary-600 text-white font-medium shadow-lg shadow-primary-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-slate-800/50 md:border-transparent'
              }`}
            >
              <span>Todas</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950/40">{totalCount}</span>
            </button>

            {categories.map(cat => (
              <div 
                key={cat.id} 
                className={`group flex items-center justify-between gap-1 flex-shrink-0 md:w-full rounded-xl border md:border-transparent transition-all ${
                  selectedCat === cat.id ? 'border-primary-600/50 bg-primary-600/10 md:bg-transparent md:border-transparent' : 'border-slate-800/50 hover:border-slate-700/80 md:border-transparent md:hover:border-transparent'
                }`}
              >
                <button
                  onClick={() => { setSelectedCat(cat.id); setPage(1); }}
                  className={`text-left px-4 md:px-3 py-2 rounded-l-xl md:rounded-xl text-sm transition-all truncate max-w-[140px] md:max-w-none md:flex-1 ${
                    selectedCat === cat.id 
                      ? 'text-primary-400 md:bg-primary-600 md:text-white md:font-medium md:shadow-lg md:shadow-primary-600/20' 
                      : 'text-slate-400 hover:text-slate-200 md:hover:bg-slate-800/50'
                  }`}
                  title={cat.name}
                >
                  {cat.name}
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 mr-1 md:mr-0 text-slate-500 hover:text-red-400 transition-all rounded-lg md:opacity-0 md:group-hover:opacity-100 flex-shrink-0"
                  title="Excluir Categoria"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-slate-500 text-xs py-4 text-center w-full">Nenhuma categoria criada ainda.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
