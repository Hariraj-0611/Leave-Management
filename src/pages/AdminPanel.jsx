import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { TrashIcon, RefreshIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const { state, exportToCSV } = useLeave();
  const [importData, setImportData] = useState('');

  const clearAllData = () => {
    if (window.confirm('⚠️ DANGER: This will delete ALL data including employees, leaves, and settings. This cannot be undone!\n\nAre you absolutely sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const resetToSample = () => {
    if (window.confirm('Reset to sample data? All current data will be replaced.')) {
      localStorage.removeItem('leaveManagementData');
      window.location.reload();
    }
  };

  const clearLeavesOnly = () => {
    if (window.confirm('Clear all leave applications? Employee data will be preserved.')) {
      const currentData = JSON.parse(localStorage.getItem('leaveManagementData') || '{}');
      const updatedData = {
        ...currentData,
        leaves: [],
        notifications: []
      };
      localStorage.setItem('leaveManagementData', JSON.stringify(updatedData));
      window.location.reload();
    }
  };

  const exportBackup = () => {
    const data = localStorage.getItem('leaveManagementData');
    const blob = new Blob([data || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_management_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      alert('Please paste JSON data to import');
      return;
    }

    try {
      const parsedData = JSON.parse(importData);
      if (window.confirm('Import this data? Current data will be overwritten.')) {
        localStorage.setItem('leaveManagementData', JSON.stringify(parsedData));
        window.location.reload();
      }
    } catch (error) {
      alert('Invalid JSON data. Please check the format.');
    }
  };

  const stats = [
    { label: 'Total Employees', value: state.employees.length },
    { label: 'Total Leaves', value: state.leaves.length },
    { label: 'Pending Approvals', value: state.leaves.filter(l => l.status === 'pending').length },
    { label: 'Notifications', value: state.notifications.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <ShieldCheckIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Data management and system controls
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Data Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clear Data Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrashIcon className="h-5 w-5 mr-2 text-red-600" />
            Clear Data
          </h3>
          <div className="space-y-3">
            <button
              onClick={clearLeavesOnly}
              className="w-full text-left p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Clear All Leaves</span>
              <span className="text-sm opacity-75">({state.leaves.length} leaves)</span>
            </button>
            <button
              onClick={resetToSample}
              className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg transition-colors flex items-center"
            >
              <RefreshIcon className="h-4 w-4 mr-2" />
              Reset to Sample Data
            </button>
            <button
              onClick={clearAllData}
              className="w-full text-left p-3 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-colors flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear ALL Data (Danger)
            </button>
          </div>
        </div>

        {/* Import/Export Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-blue-600" />
            Import & Export
          </h3>
          <div className="space-y-4">
            <div>
              <button
                onClick={exportBackup}
                className="w-full mb-2 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export Full Backup (JSON)
              </button>
              <button
                onClick={exportToCSV}
                className="w-full p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg transition-colors flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export Leaves as CSV
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Import JSON Data
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON data here..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleImport}
                className="w-full mt-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Import Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Data Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Data Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Leaves</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.leaves.slice(-5).map((leave) => (
                <div key={leave.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium">{leave.employeeName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {leave.startDate} - {leave.endDate} • {leave.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Employees</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.employees.map((emp) => (
                <div key={emp.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {emp.department} • {emp.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Warning</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
              <ul className="list-disc pl-5 space-y-1">
                <li>Clearing data cannot be undone</li>
                <li>Always export a backup before clearing data</li>
                <li>These functions are intended for development and testing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;