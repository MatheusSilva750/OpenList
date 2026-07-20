import React from 'react';
import { useDashboard } from './DashboardContext';
import { LogOut, FileText, User, CheckCircle2 } from 'lucide-react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Divider, Tooltip } from '@mui/material';

export default function Header() {
  const { user, onLogout, navigateToDocs } = useDashboard();

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary', backgroundImage: 'none' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, color: 'primary.contrastText', display: 'flex' }}>
            <CheckCircle2 size={24} />
          </Box>
          <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
            OpenList
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Button
            onClick={navigateToDocs}
            startIcon={<FileText size={18} />}
            color="inherit"
            sx={{ textTransform: 'none', display: { xs: 'none', sm: 'flex' } }}
          >
            API
          </Button>
          <Tooltip title="Documentação API">
             <IconButton onClick={navigateToDocs} color="inherit" sx={{ display: { xs: 'flex', sm: 'none' } }}>
               <FileText size={20} />
             </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem variant="middle" sx={{ display: { xs: 'none', sm: 'block' } }} />

          <Tooltip title={user?.email || ''}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <User size={18} />
              <Typography variant="body2" sx={{ maxWidth: { xs: 100, md: 150 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: { xs: 'none', sm: 'block' } }}>
                {user?.email}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Sair">
            <IconButton onClick={onLogout} color="error" sx={{ ml: { xs: 0, sm: 1 } }}>
              <LogOut size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
