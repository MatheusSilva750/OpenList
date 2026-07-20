import React from 'react';
import { useDashboard } from './DashboardContext';
import { LogOut, FileText, User, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const { user, onLogout, navigateToDocs } = useDashboard();

  return (
    <header className="glass border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary-600/20 rounded-xl text-primary-400 border border-primary-500/20">
          <CheckCircle2 size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">OpenList</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={navigateToDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
        >
          <FileText size={16} />
          Documentação API
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <User size={16} className="text-primary-400" />
          <span className="max-w-[150px] truncate">{user?.email}</span>
        </div>

        <button
          onClick={onLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
