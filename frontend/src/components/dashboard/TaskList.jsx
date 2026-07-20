import React from 'react';
import { useDashboard } from './DashboardContext';
import { CheckCircle2, Circle, Users, Calendar, Share2, Edit3, Trash2 } from 'lucide-react';
import Pagination from './Pagination';

export default function TaskList() {
  const { 
    user, 
    tasks, 
    loadingTasks, 
    handleToggleTask, 
    handleDeleteTask, 
    openTaskModal, 
    setSharingTask, 
    setShareEmail, 
    setShareMessage, 
    setShareError, 
    isOverdue 
  } = useDashboard();

  return (
    <>
      <div className="flex flex-col gap-3">
        {loadingTasks ? (
          <div className="text-center py-12 text-slate-500">Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
            <CheckCircle2 size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="font-semibold text-slate-300">Tudo limpo por aqui!</p>
            <p className="text-sm text-slate-500 mt-1">Crie uma nova tarefa ou ajuste os filtros.</p>
          </div>
        ) : (
          tasks.map(task => {
            const overdue = isOverdue(task.due_date, task.completed);
            return (
              <div 
                key={task.id} 
                className={`glass-card p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-2 ${
                  task.completed 
                    ? 'border-slate-800/40 bg-slate-900/10 opacity-70' 
                    : overdue 
                    ? 'border-red-950/80 bg-red-950/5' 
                    : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/10'
                }`}
              >
                
                {/* Toggle button and task text */}
                <div className="flex gap-3 w-full sm:flex-1 min-w-0">
                  <button 
                    onClick={() => handleToggleTask(task.id)}
                    className={`mt-0.5 flex-shrink-0 transition-colors ${
                      task.completed ? 'text-primary-500 hover:text-primary-400' : 'text-slate-500 hover:text-primary-500'
                    }`}
                  >
                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-medium text-sm md:text-base truncate text-white ${
                        task.completed ? 'line-through text-slate-500' : ''
                      }`}>
                        {task.title}
                      </h4>
                      
                      {/* Category Badge */}
                      {task.category_details && (
                        <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {task.category_details.name}
                        </span>
                      )}

                      {/* Shared Badge */}
                      {(task.shared_with?.length > 0) && (
                        <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 flex items-center gap-1" title="Compartilhada com outros">
                          <Users size={10} />
                          {task.shared_with.length}
                        </span>
                      )}
                      
                      {/* If shared *with me* (is owner email different from current user?) */}
                      {task.owner_email && task.owner_email.toLowerCase() !== user?.email?.toLowerCase() && (
                        <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900/60 text-emerald-400 border border-emerald-500/20 flex items-center gap-1" title={`Dono: ${task.owner_email}`}>
                          Recebida
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className={`text-slate-400 text-xs md:text-sm mt-1 whitespace-pre-wrap ${
                        task.completed ? 'line-through text-slate-600' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}

                    {/* Metadata Footer */}
                    {task.due_date && (
                      <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-1 rounded bg-slate-950/40 ${
                        overdue 
                          ? 'text-red-400' 
                          : task.completed 
                          ? 'text-slate-500' 
                          : 'text-slate-400'
                      }`}>
                        <Calendar size={12} />
                        <span>{task.due_date} {overdue && '(Vencida)'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Actions */}
                <div className="flex items-center justify-end gap-1 w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/40">
                  {/* Share Button (Only if Owner) */}
                  {task.owner_email && task.owner_email.toLowerCase() === user?.email?.toLowerCase() && (
                    <>
                      <button
                        onClick={() => { setSharingTask(task); setShareEmail(''); setShareMessage(null); setShareError(null); }}
                        className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/40 rounded-xl transition-all"
                        title="Compartilhar tarefa"
                      >
                        <Share2 size={16} />
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => openTaskModal(task)}
                        className="p-2 text-slate-500 hover:text-primary-400 hover:bg-slate-800/40 rounded-xl transition-all"
                        title="Editar tarefa"
                      >
                        <Edit3 size={16} />
                      </button>
                    </>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800/40 rounded-xl transition-all"
                    title="Excluir tarefa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      <Pagination />
    </>
  );
}
