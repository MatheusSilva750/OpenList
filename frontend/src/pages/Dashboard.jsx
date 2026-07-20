import React from 'react';
import { DashboardProvider } from '../components/dashboard/DashboardContext';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import TaskFilters from '../components/dashboard/TaskFilters';
import TaskList from '../components/dashboard/TaskList';
import TaskModal from '../components/dashboard/modals/TaskModal';
import CategoryModal from '../components/dashboard/modals/CategoryModal';
import ShareTaskModal from '../components/dashboard/modals/ShareTaskModal';
import { Box, Container } from '@mui/material';

export default function Dashboard({ user, onLogout, navigateToDocs }) {
  return (
    <DashboardProvider user={user} onLogout={onLogout} navigateToDocs={navigateToDocs}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Header />

        <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            
            <Sidebar />

            <Box sx={{ gridColumn: { md: 'span 2', lg: 'span 3' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TaskFilters />
              <TaskList />
            </Box>
          </Box>
        </Container>

        <TaskModal />
        <CategoryModal />
        <ShareTaskModal />
      </Box>
    </DashboardProvider>
  );
}
