import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../../api/client';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children, user, onLogout, navigateToDocs }) => {
  // Lists
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading States
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);

  // Pagination
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(''); // Category UUID
  const [statusFilter, setStatusFilter] = useState(''); // 'true', 'false', ''

  // Form Modals / Inputs
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskCatId, setTaskCatId] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  const [sharingTask, setSharingTask] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState(null);
  const [shareError, setShareError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [page, search, selectedCat, statusFilter]);

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const res = await client.get('/categories/', { params: { page_size: 100 } });
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
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      if (selectedCat) params.category = selectedCat;
      if (statusFilter) params.completed = statusFilter;

      const res = await client.get('/tasks/', { params });
      
      if (res.data.results) {
        setTasks(res.data.results);
        const count = res.data.count || 0;
        setTotalCount(count);
        setTotalPages(Math.ceil(count / PAGE_SIZE) || 1);
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
    if (!window.confirm('Deseja realmente excluir esta categoria? As tarefas associadas perderão a categoria.')) return;
    try {
      await client.delete(`/categories/${catId}/`);
      if (selectedCat === catId) setSelectedCat('');
      fetchCategories();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await client.post(`/tasks/${taskId}/toggle/`);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Excluir esta tarefa?')) return;
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
      fetchTasks();
    } catch (err) {
      setShareError(err.response?.data?.detail || err.response?.data?.email || 'Erro ao compartilhar.');
    }
  };

  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T12:00:00');
    return due < today;
  };

  const contextValue = {
    user,
    onLogout,
    navigateToDocs,
    tasks,
    categories,
    loadingTasks,
    loadingCats,
    page,
    setPage,
    totalPages,
    totalCount,
    search,
    setSearch,
    selectedCat,
    setSelectedCat,
    statusFilter,
    setStatusFilter,
    showTaskModal,
    setShowTaskModal,
    editingTask,
    setEditingTask,
    taskTitle,
    setTaskTitle,
    taskDesc,
    setTaskDesc,
    taskDueDate,
    setTaskDueDate,
    taskCatId,
    setTaskCatId,
    newCatName,
    setNewCatName,
    showCatModal,
    setShowCatModal,
    sharingTask,
    setSharingTask,
    shareEmail,
    setShareEmail,
    shareMessage,
    setShareMessage,
    shareError,
    setShareError,
    handleCreateCategory,
    handleDeleteCategory,
    handleToggleTask,
    handleDeleteTask,
    openTaskModal,
    handleSaveTask,
    handleShareTask,
    isOverdue,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
