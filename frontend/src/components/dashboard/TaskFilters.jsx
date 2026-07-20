import React from 'react';
import { useDashboard } from './DashboardContext';
import { Search, Plus } from 'lucide-react';
import { Box, Paper, TextField, InputAdornment, Button, MenuItem, Select, FormControl } from '@mui/material';

export default function TaskFilters() {
  const { search, setSearch, setPage, statusFilter, setStatusFilter, openTaskModal } = useDashboard();

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      {/* Search Input */}
      <TextField
        size="small"
        placeholder="Buscar tarefas..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        sx={{ width: { xs: '100%', md: 'auto' }, flexGrow: { md: 1 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }
        }}
      />

      {/* Status Filter & Add Task */}
      <Box sx={{ display: 'flex', width: { xs: '100%', md: 'auto' }, gap: 2 }}>
        <FormControl size="small" sx={{ flexGrow: 1, minWidth: 150 }}>
          <Select
            value={statusFilter}
            displayEmpty
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Status: Todos</MenuItem>
            <MenuItem value="false">Pendentes</MenuItem>
            <MenuItem value="true">Concluídas</MenuItem>
          </Select>
        </FormControl>

        <Button
          id="add-task-btn"
          variant="contained"
          onClick={() => openTaskModal()}
          startIcon={<Plus size={18} />}
          sx={{ borderRadius: 2, flexShrink: 0, px: 3 }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Nova Tarefa</Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Nova</Box>
        </Button>
      </Box>
    </Paper>
  );
}
