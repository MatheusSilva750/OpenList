import React from 'react';
import { useDashboard } from './DashboardContext';
import { Search, Plus } from 'lucide-react';

export default function TaskFilters() {
  const { search, setSearch, setPage, statusFilter, setStatusFilter, openTaskModal } = useDashboard();

  return (
    <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Status Filter Toggle */}
      <div className="flex gap-2">
        <select
          className="bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Status: Todos</option>
          <option value="false">Pendentes</option>
          <option value="true">Concluídas</option>
        </select>

        {/* Add Task Button */}
        <button
          id="add-task-btn"
          onClick={() => openTaskModal()}
          className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-primary-600/10 active:scale-95 flex items-center gap-1.5"
        >
          <Plus size={16} />
          Nova Tarefa
        </button>
      </div>
    </div>
  );
}
