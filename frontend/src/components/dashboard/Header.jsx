import React from 'react';
import { useDashboard } from './DashboardContext';
import { LogOut, FileText, User, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const { user, onLogout, navigateToDocs } = useDashboard();

  return (
    <header className="glass border-b border-slate-800 sticky top-0 z-40 px-4 md:px-6 py-4 flex flex-wrap justify-between items-center gap-2 md:gap-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 md:p-2 bg-primary-600/20 rounded-xl text-primary-400 border border-primary-500/20 flex-shrink-0">
          <CheckCircle2 size={20} className="md:w-6 md:h-6" />
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">OpenList</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={navigateToDocs}
          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
          title="Documentação API"
        >
          <FileText size={16} />
          <span className="hidden sm:inline">API</span>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-2 text-slate-300 text-sm" title={user?.email}>
          <User size={16} className="text-primary-400" />
          <span className="hidden sm:inline max-w-[100px] md:max-w-[150px] truncate">{user?.email}</span>
        </div>

        <button
          onClick={onLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1 md:ml-0"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
