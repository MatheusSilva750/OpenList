import React from 'react';
import { useDashboard } from '../DashboardContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box
} from '@mui/material';

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

  return (
    <Dialog 
      open={showTaskModal} 
      onClose={() => setShowTaskModal(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: 'form',
        onSubmit: handleSaveTask,
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle fontWeight="bold">
        {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Título"
            required
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Comprar mantimentos..."
          />

          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Lista de compras: leite, pão, maçã..."
          />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <TextField
              label="Data Limite"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel id="task-category-label">Categoria</InputLabel>
              <Select
                labelId="task-category-label"
                label="Categoria"
                value={taskCatId}
                onChange={(e) => setTaskCatId(e.target.value)}
              >
                <MenuItem value=""><em>Nenhuma</em></MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={() => setShowTaskModal(false)} color="inherit">
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
