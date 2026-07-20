import React from 'react';
import { useDashboard } from './DashboardContext';
import { CheckCircle2, Circle, Users, Calendar, Share2, Edit3, Trash2 } from 'lucide-react';
import Pagination from './Pagination';
import { Box, Paper, Typography, IconButton, Chip, Tooltip, Stack } from '@mui/material';

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
      <Stack spacing={2}>
        {loadingTasks ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            Carregando tarefas...
          </Box>
        ) : tasks.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3, bgcolor: 'background.paper', color: 'text.secondary' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto', opacity: 0.5, marginBottom: 16 }} />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Tudo limpo por aqui!
            </Typography>
            <Typography variant="body2" mt={1}>
              Crie uma nova tarefa ou ajuste os filtros.
            </Typography>
          </Paper>
        ) : (
          tasks.map(task => {
            const overdue = isOverdue(task.due_date, task.completed);
            return (
              <Paper 
                key={task.id} 
                elevation={task.completed ? 0 : 2}
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between', 
                  gap: { xs: 2, sm: 1 },
                  bgcolor: task.completed ? 'action.hover' : (overdue ? 'error.dark' : 'background.paper'),
                  backgroundImage: overdue ? 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))' : 'none',
                  opacity: task.completed ? 0.7 : 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: task.completed ? 0 : 4,
                  }
                }}
              >
                
                {/* Toggle button and task text */}
                <Box sx={{ display: 'flex', gap: 2, width: '100%', flex: { sm: 1 }, minWidth: 0 }}>
                  <IconButton 
                    onClick={() => handleToggleTask(task.id)}
                    color={task.completed ? 'primary' : 'default'}
                    sx={{ mt: -0.5, flexShrink: 0 }}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </IconButton>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="medium" 
                        sx={{ 
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                          wordBreak: 'break-word'
                        }}
                      >
                        {task.title}
                      </Typography>
                      
                      {/* Category Badge */}
                      {task.category_details && (
                        <Chip 
                          label={task.category_details.name} 
                          size="small" 
                          variant="outlined" 
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} 
                        />
                      )}

                      {/* Shared Badge */}
                      {(task.shared_with?.length > 0) && (
                        <Chip 
                          icon={<Users size={12} />} 
                          label={task.shared_with.length} 
                          size="small" 
                          color="info"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} 
                          title="Compartilhada com outros"
                        />
                      )}
                      
                      {/* If shared *with me* (is owner email different from current user?) */}
                      {task.owner_email && task.owner_email.toLowerCase() !== user?.email?.toLowerCase() && (
                        <Chip 
                          label="Recebida" 
                          size="small" 
                          color="success"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} 
                          title={`Dono: ${task.owner_email}`}
                        />
                      )}
                    </Box>

                    {task.description && (
                      <Typography 
                        variant="body2" 
                        color={task.completed ? 'text.disabled' : 'text.secondary'}
                        sx={{ mt: 0.5, whiteSpace: 'pre-wrap', textDecoration: task.completed ? 'line-through' : 'none' }}
                      >
                        {task.description}
                      </Typography>
                    )}

                    {/* Metadata Footer */}
                    {task.due_date && (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1.5, px: 1, py: 0.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                        <Calendar size={14} color={overdue ? '#ef4444' : 'inherit'} />
                        <Typography variant="caption" fontWeight="medium" color={overdue ? 'error.main' : (task.completed ? 'text.disabled' : 'text.secondary')}>
                          {task.due_date} {overdue && '(Vencida)'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Task Actions */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    gap: 0.5, 
                    width: { xs: '100%', sm: 'auto' }, 
                    flexShrink: 0, 
                    mt: { xs: 1, sm: 0 }, 
                    pt: { xs: 1, sm: 0 }, 
                    borderTop: { xs: 1, sm: 0 }, 
                    borderColor: 'divider' 
                  }}
                >
                  {/* Share Button (Only if Owner) */}
                  {task.owner_email && task.owner_email.toLowerCase() === user?.email?.toLowerCase() && (
                    <>
                      <Tooltip title="Compartilhar tarefa">
                        <IconButton
                          onClick={() => { setSharingTask(task); setShareEmail(''); setShareMessage(null); setShareError(null); }}
                          color="info"
                          size="small"
                        >
                          <Share2 size={18} />
                        </IconButton>
                      </Tooltip>
                      
                      {/* Edit Button */}
                      <Tooltip title="Editar tarefa">
                        <IconButton
                          onClick={() => openTaskModal(task)}
                          color="primary"
                          size="small"
                        >
                          <Edit3 size={18} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  {/* Delete Button */}
                  <Tooltip title="Excluir tarefa">
                    <IconButton
                      onClick={() => handleDeleteTask(task.id)}
                      color="error"
                      size="small"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            );
          })
        )}
      </Stack>

      <Pagination />
    </>
  );
}
