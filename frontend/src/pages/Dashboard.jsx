import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  Plus, 
  FolderPlus, 
  Trash2, 
  Share2, 
  Edit3, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Users, 
  FileText,
  User,
  X,
  PlusCircle
} from 'lucide-react';

export default function Dashboard({ user, onLogout, navigateToDocs }) {
  // Lists
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading States
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(''); // Category UUID
  const [statusFilter, setStatusFilter] = useState(''); // 'true', 'false', ''

  // Form Modals / Inputs
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null if creating, task object if editing
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskCatId, setTaskCatId] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  const [sharingTask, setSharingTask] = useState(null); // task object
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState(null);
  const [shareError, setShareError] = useState(null);

  // Load Categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reload tasks when filters or page changes
  useEffect(() => {
    fetchTasks();
  }, [page, search, selectedCat, statusFilter]);

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const res = await client.get('/categories/');
      // Django rest framework returns list directly or paginated list.
      // Usually, viewsets have pagination, but categories are set to use DRF default.
      // DRF default pagination returns { results: [...] } if enabled, or raw list.
      // Since default pagination is PageNumberPagination in settings.py, it returns results:
      const data = res.data.results ? res.data.results : res.data;
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories", err);
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (selectedCat) params.category = selectedCat;
      if (statusFilter) params.completed = statusFilter;

      const res = await client.get('/tasks/', { params });
      
      if (res.data.results) {
        setTasks(res.data.results);
        // Calculate total pages
        // Page size is 10 as per backend settings.py
        const count = res.data.count || 0;
        setTotalCount(count);
        setTotalPages(Math.ceil(count / 10) || 1);
      } else {
        setTasks(res.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error loading tasks", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Categories CRUD
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await client.post('/categories/', { name: newCatName.trim() });
      setNewCatName('');
      setShowCatModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.non_field_errors || err.response?.data?.name || 'Erro ao criar categoria.');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Deseja realmente excluir esta categoria? As tarefas associadas perderão a categoria.')) return;
    try {
      await client.delete(`/categories/${catId}/`);
      if (selectedCat === catId) setSelectedCat('');
      fetchCategories();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Tasks CRUD & Actions
  const handleToggleTask = async (taskId) => {
    try {
      await client.post(`/tasks/${taskId}/toggle/`);
      // Update local state directly for fast responsiveness
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Excluir esta tarefa?')) return;
    try {
      await client.delete(`/tasks/${taskId}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskDesc(task.description);
      setTaskDueDate(task.due_date || '');
      setTaskCatId(task.category || '');
    } else {
      setEditingTask(null);
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
      setTaskCatId('');
    }
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const payload = {
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      due_date: taskDueDate || null,
      category: taskCatId || null
    };

    try {
      if (editingTask) {
        await client.put(`/tasks/${editingTask.id}/`, payload);
      } else {
        await client.post('/tasks/', payload);
      }
      setShowTaskModal(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao salvar tarefa.');
    }
  };

  const handleShareTask = async (e) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    setShareMessage(null);
    setShareError(null);

    try {
      await client.post(`/tasks/${sharingTask.id}/share/`, { email: shareEmail.trim() });
      setShareMessage(`Tarefa compartilhada com sucesso com ${shareEmail}`);
      setShareEmail('');
      fetchTasks(); // Reload to update shared count/icons
    } catch (err) {
      setShareError(err.response?.data?.detail || err.response?.data?.email || 'Erro ao compartilhar.');
    }
  };

  // Helper to check if task is overdue
  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T12:00:00'); // avoid timezone shifts
    return due < today;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navbar */}
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
            <span className="max-w-[150px] truncate">{user.email}</span>
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

      {/* Main Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Categories Sidebar */}
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

        {/* Tasks List Content */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Action Bar (Search & Filter) */}
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

          {/* Tasks Grid */}
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
                    className={`glass-card p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                      task.completed 
                        ? 'border-slate-800/40 bg-slate-900/10 opacity-70' 
                        : overdue 
                        ? 'border-red-950/80 bg-red-950/5' 
                        : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/10'
                    }`}
                  >
                    
                    {/* Toggle button and task text */}
                    <div className="flex gap-3 flex-1 min-w-0">
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
                          {(task.shared_with.length > 0) && (
                            <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 flex items-center gap-1" title="Compartilhada com outros">
                              <Users size={10} />
                              {task.shared_with.length}
                            </span>
                          )}
                          
                          {/* If shared *with me* (is owner email different from current user?) */}
                          {task.owner_email && task.owner_email.toLowerCase() !== user.email.toLowerCase() && (
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
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Share Button (Only if Owner) */}
                      {task.owner_email && task.owner_email.toLowerCase() === user.email.toLowerCase() && (
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

                      {/* Delete Button (Allowed for both owner and shared member to clear, but API ensures security) */}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
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
          )}

        </section>
      </main>

      {/* MODAL: CREATE / EDIT TASK */}
      {showTaskModal && (
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
      )}

      {/* MODAL: CREATE CATEGORY */}
      {showCatModal && (
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
      )}

      {/* MODAL: SHARE TASK */}
      {sharingTask && (
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
      )}

    </div>
  );
}
