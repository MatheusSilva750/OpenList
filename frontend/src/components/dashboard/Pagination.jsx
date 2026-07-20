import React from 'react';
import { useDashboard } from './DashboardContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  const { totalPages, page, setPage, totalCount } = useDashboard();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <span className="text-xs md:text-sm text-slate-400">
        Página {page} de {totalPages} ({totalCount} tarefas)
      </span>
      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="p-2 border border-slate-800 rounded-xl bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="p-2 border border-slate-800 rounded-xl bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
