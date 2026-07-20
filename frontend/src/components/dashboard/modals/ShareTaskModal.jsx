import React from 'react';
import { useDashboard } from '../DashboardContext';
import { X } from 'lucide-react';

export default function ShareTaskModal() {
  const { 
    sharingTask, 
    setSharingTask, 
    shareEmail, 
    setShareEmail, 
    shareMessage, 
    shareError, 
    handleShareTask 
  } = useDashboard();

  if (!sharingTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
        <button 
          onClick={() => setSharingTask(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>
        <h3 className="text-xl font-bold text-white mb-2">Compartilhar Tarefa</h3>
        <p className="text-slate-400 text-xs mb-6">Insira o e-mail do usuário com quem deseja compartilhar a tarefa: "{sharingTask.title}"</p>
        
        {shareMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs">
            {shareMessage}
          </div>
        )}
        {shareError && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
            {shareError}
          </div>
        )}

        <form onSubmit={handleShareTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">E-mail do Destinatário</label>
            <input
              type="email"
              required
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="amigo@exemplo.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setSharingTask(null)}
              className="px-4 py-2 border border-slate-800 text-sm font-semibold rounded-xl text-slate-300 hover:bg-slate-800"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-sm font-semibold rounded-xl text-white shadow-lg"
            >
              Compartilhar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
