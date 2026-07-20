import React from 'react';
import { DashboardProvider } from '../components/dashboard/DashboardContext';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import TaskFilters from '../components/dashboard/TaskFilters';
import TaskList from '../components/dashboard/TaskList';
import TaskModal from '../components/dashboard/modals/TaskModal';
import CategoryModal from '../components/dashboard/modals/CategoryModal';
import ShareTaskModal from '../components/dashboard/modals/ShareTaskModal';

export default function Dashboard({ user, onLogout, navigateToDocs }) {
  return (
    <DashboardProvider user={user} onLogout={onLogout} navigateToDocs={navigateToDocs}>
      <div className="min-h-screen flex flex-col">
        {/* Header Navbar */}
        <Header />

        {/* Main Layout Grid */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Categories Sidebar */}
          <Sidebar />

          {/* Tasks List Content */}
          <section className="lg:col-span-3 flex flex-col gap-4">
            {/* Action Bar (Search & Filter) */}
            <TaskFilters />

            {/* Tasks Grid & Pagination */}
            <TaskList />
          </section>
        </main>

        {/* Modals */}
        <TaskModal />
        <CategoryModal />
        <ShareTaskModal />
      </div>
    </DashboardProvider>
  );
}
