import React from 'react';
import { useDashboard } from './DashboardContext';
import { Pagination as MuiPagination, Box, Typography } from '@mui/material';

export default function Pagination() {
  const { totalPages, page, setPage, totalCount } = useDashboard();

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, px: 1, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Página {page} de {totalPages} ({totalCount} tarefas)
      </Typography>
      <MuiPagination 
        count={totalPages} 
        page={page} 
        onChange={(_, val) => setPage(val)} 
        color="primary" 
        shape="rounded" 
        siblingCount={0}
      />
    </Box>
  );
}
