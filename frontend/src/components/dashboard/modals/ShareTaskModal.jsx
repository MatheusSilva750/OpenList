import React from 'react';
import { useDashboard } from '../DashboardContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions, 
  Button, 
  TextField,
  Alert,
  Box
} from '@mui/material';

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

  return (
    <Dialog 
      open={!!sharingTask} 
      onClose={() => setSharingTask(null)}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleShareTask,
          sx: { borderRadius: 3 }
        }
      }}
    >
      <DialogTitle fontWeight="bold">
        Compartilhar Tarefa
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText mb={3}>
          Insira o e-mail do usuário com quem deseja compartilhar a tarefa: "{sharingTask?.title}"
        </DialogContentText>

        {shareMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {shareMessage}
          </Alert>
        )}
        
        {shareError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {shareError}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <TextField
            label="E-mail do Destinatário"
            type="email"
            required
            fullWidth
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="amigo@exemplo.com"
            autoFocus
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={() => setSharingTask(null)} color="inherit">
          Fechar
        </Button>
        <Button type="submit" variant="contained">
          Compartilhar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
