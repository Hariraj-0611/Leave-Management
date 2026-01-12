import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import ApplyLeave from './pages/ApplyLeave';
import MyLeaves from './pages/MyLeaves';
import Approvals from './pages/Approvals';
import Employees from './pages/Employees';
import { LeaveProvider } from './context/LeaveContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <LeaveProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/apply" element={<ApplyLeave />} />
              <Route path="/leaves" element={<MyLeaves />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </LeaveProvider>
  );
}

export default App;