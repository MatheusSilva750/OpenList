import React from 'react';
import { useDashboard } from '../DashboardContext';
import { X } from 'lucide-react';

export default function TaskModal() {
  const { 
    showTaskModal, 
    setShowTaskModal, 
    editingTask, 
    handleSaveTask, 
    taskTitle, 
    setTaskTitle, 
    taskDesc, 
    setTaskDesc, 
    taskDueDate, 
    setTaskDueDate, 
    taskCatId, 
    setTaskCatId, 
    categories 
  } = useDashboard();

  if (!showTaskModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
        <button 
          onClick={() => setShowTaskModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>
        <h3 className="text-xl font-bold text-white mb-6">
          {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h3>
        
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Título</label>
            <input
              id="task-title-input"
              type="text"
              required
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Comprar mantimentos..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Descrição</label>
            <textarea
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 h-24 resize-none"
              placeholder="Lista de compras: leite, pão, maçã..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Data Limite</label>
              <input
                type="date"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Categoria</label>
              <select
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={taskCatId}
                onChange={(e) => setTaskCatId(e.target.value)}
              >
                <option value="">Nenhuma</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setShowTaskModal(false)}
              className="px-4 py-2 border border-slate-800 text-sm font-semibold rounded-xl text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              id="task-save-btn"
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-sm font-semibold rounded-xl text-white shadow-lg"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
