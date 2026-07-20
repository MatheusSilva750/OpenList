import React from 'react';
import { useDashboard } from '../DashboardContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box
} from '@mui/material';

export default function CategoryModal() {
  const { 
    showCatModal, 
    setShowCatModal, 
    newCatName, 
    setNewCatName, 
    handleCreateCategory 
  } = useDashboard();

  return (
    <Dialog 
      open={showCatModal} 
      onClose={() => setShowCatModal(false)}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleCreateCategory,
          sx: { borderRadius: 3 }
        }
      }}
    >
      <DialogTitle fontWeight="bold">
        Criar Categoria
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ pt: 1 }}>
          <TextField
            label="Nome da Categoria"
            required
            fullWidth
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Trabalho, Pessoal, Fitness..."
            autoFocus
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={() => setShowCatModal(false)} color="inherit">
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
