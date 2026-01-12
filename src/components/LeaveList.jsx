import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useLeave } from '../context/LeaveContext';

const LeaveList = ({ mode = 'employee' }) => {
  const { state, updateLeaveStatus } = useLeave();
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    department: 'all',
  });
  const [search, setSearch] = useState('');

  const isManager = state.currentUser?.role === 'manager';

  const filteredLeaves = state.leaves.filter(leave => {
    if (mode === 'employee' && leave.employeeId !== state.currentUser?.id) return false;
    if (mode === 'approval' && !isManager) return false;
    
    // Apply filters
    if (filters.status !== 'all' && leave.status !== filters.status) return false;
    if (filters.type !== 'all' && leave.type !== filters.type) return false;
    
    // Apply search
    if (search && !leave.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    
    // For managers in approval mode, show their team's leaves
    if (mode === 'approval' && isManager) {
      const employee = state.employees.find(emp => emp.id === leave.employeeId);
      return employee?.managerId === state.currentUser?.id;
    }
    
    return true;
  });

  const handleApprove = (leaveId) => {
    if (window.confirm('Are you sure you want to approve this leave?')) {
      updateLeaveStatus(leaveId, 'approved');
    }
  };

  const handleReject = (leaveId) => {
    if (window.confirm('Are you sure you want to reject this leave?')) {
      updateLeaveStatus(leaveId, 'rejected');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Pending' },
      approved: { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Approved' },
      rejected: { class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Rejected' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">
          {mode === 'employee' ? 'My Leave Applications' : 'Pending Approvals'}
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 pr-4 py-2 text-sm w-48"
            />
            <EyeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-field py-2 text-sm"
            >
              <option value="all">All Types</option>
              {Object.entries(state.leaveTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredLeaves.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            No leaves found
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === 'employee' 
              ? 'You have no leave applications' 
              : 'No pending approvals'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {mode === 'employee' ? 'Applied On' : 'Employee'}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Leave Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reason
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                {mode === 'approval' && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                
                return (
                  <tr 
                    key={leave.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-4 px-4">
                      {mode === 'employee' ? (
                        <div className="text-sm">
                          {new Date(leave.appliedDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">{leave.employeeName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(leave.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge ${state.leaveTypes[leave.type].color}`}>
                        {state.leaveTypes[leave.type].name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        {leave.startDate} to {leave.endDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {days} day{days !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(leave.status)}
                    </td>
                    {mode === 'approval' && leave.status === 'pending' && (
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveList;