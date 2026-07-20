import React from 'react';
import { useDashboard } from './DashboardContext';
import { Plus, Trash2 } from 'lucide-react';
import { Paper, Typography, Box, IconButton, Chip, CircularProgress, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function Sidebar() {
  const { 
    categories, 
    loadingCats, 
    selectedCat, 
    setSelectedCat, 
    setPage, 
    totalCount, 
    setShowCatModal, 
    handleDeleteCategory 
  } = useDashboard();

  return (
    <Box sx={{ gridColumn: { md: 'span 1' } }}>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Categorias
          </Typography>
          <IconButton
            size="small"
            color="primary"
            onClick={() => setShowCatModal(true)}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <Plus size={16} />
          </IconButton>
        </Box>

        {loadingCats ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {/* Mobile View: Horizontal Scroll with Chips */}
            <Box 
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                flexDirection: 'row', 
                gap: 1, 
                overflowX: 'auto', 
                pb: 1,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' } 
              }}
            >
              <Chip
                label={`Todas (${totalCount})`}
                clickable
                color={selectedCat === '' ? 'primary' : 'default'}
                onClick={() => { setSelectedCat(''); setPage(1); }}
                sx={{ fontWeight: selectedCat === '' ? 'bold' : 'normal' }}
              />
              {categories.map(cat => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  clickable
                  color={selectedCat === cat.id ? 'primary' : 'default'}
                  onClick={() => { setSelectedCat(cat.id); setPage(1); }}
                  onDelete={() => handleDeleteCategory(cat.id)}
                  deleteIcon={<Trash2 size={14} />}
                  sx={{ fontWeight: selectedCat === cat.id ? 'bold' : 'normal' }}
                />
              ))}
              {categories.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ py: 1 }}>
                  Nenhuma categoria ainda.
                </Typography>
              )}
            </Box>

            {/* Desktop View: Vertical List */}
            <List sx={{ display: { xs: 'none', md: 'block' }, p: 0, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={selectedCat === ''}
                  onClick={() => { setSelectedCat(''); setPage(1); }}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary="Todas" slotProps={{ primary: { variant: 'body2', fontWeight: selectedCat === '' ? 'bold' : 'normal' } }} />
                  <Chip size="small" label={totalCount} />
                </ListItemButton>
              </ListItem>

              {categories.map(cat => (
                <ListItem 
                  key={cat.id} 
                  disablePadding
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" size="small" color="error" onClick={() => handleDeleteCategory(cat.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  }
                >
                  <ListItemButton 
                    selected={selectedCat === cat.id}
                    onClick={() => { setSelectedCat(cat.id); setPage(1); }}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText primary={cat.name} slotProps={{ primary: { variant: 'body2', fontWeight: selectedCat === cat.id ? 'bold' : 'normal', noWrap: true, sx: { pr: 4 } } }} />
                  </ListItemButton>
                </ListItem>
              ))}
              
              {categories.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Nenhuma categoria criada ainda.
                </Typography>
              )}
            </List>
          </>
        )}
      </Paper>
    </Box>
  );
}
