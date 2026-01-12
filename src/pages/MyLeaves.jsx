import React, { useState, useEffect } from 'react';
import { useLeave } from '../context/LeaveContext';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const MyLeaves = () => {
  const { state } = useLeave();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  console.log('MyLeaves - Current user:', state.currentUser);
  console.log('MyLeaves - All leaves:', state.leaves);
  
  // Get current user's leaves
  const userLeaves = state.leaves.filter(leave => {
    // Match by employeeId OR employeeName
    const isUserLeave = leave.employeeId === state.currentUser?.id || 
                       leave.employeeName === state.currentUser?.name;
    
    if (!isUserLeave) return false;
    
    // Apply status filter
    if (filter !== 'all' && leave.status !== filter) return false;
    
    // Apply search filter
    if (search && !leave.reason?.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });
  
  console.log('Filtered user leaves:', userLeaves);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckIcon className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XMarkIcon className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getLeaveTypeColor = (type) => {
    return state.leaveTypes[type]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Leaves</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and track your leave applications
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {userLeaves.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Applications</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {userLeaves.filter(l => l.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Approved</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {userLeaves.filter(l => l.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {userLeaves.filter(l => l.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Leaves Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {userLeaves.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              No leave applications found
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filter !== 'all' 
                ? `You have no ${filter} leave applications` 
                : 'You have not applied for any leaves yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {userLeaves.map((leave) => {
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                  
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.type)}`}>
                          {state.leaveTypes[leave.type]?.name || leave.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {days} day{days !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {leave.reason || 'No reason provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(leave.appliedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              Debug Information
            </summary>
            <div className="mt-2 space-y-2">
              <div className="text-xs">
                <strong>Current User ID:</strong> {state.currentUser?.id}
              </div>
              <div className="text-xs">
                <strong>Current User Name:</strong> {state.currentUser?.name}
              </div>
              <div className="text-xs">
                <strong>Total Leaves in System:</strong> {state.leaves.length}
              </div>
              <div className="text-xs">
                <strong>User's Leaves:</strong> {userLeaves.length}
              </div>
              <div className="text-xs">
                <strong>All Leaves:</strong>
                <pre className="mt-1 p-2 bg-gray-200 dark:bg-gray-900 rounded overflow-auto text-xs">
                  {JSON.stringify(state.leaves, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;