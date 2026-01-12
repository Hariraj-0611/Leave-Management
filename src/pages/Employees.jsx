import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Employees = () => {
  const { state } = useLeave();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  if (state.currentUser?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Restricted
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manager access required to view employee directory
        </p>
      </div>
    );
  }

  const filteredEmployees = state.employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) ||
                         employee.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || employee.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getEmployeeLeaveStats = (employeeId) => {
    const employeeLeaves = state.leaves.filter(l => l.employeeId === employeeId);
    return {
      total: employeeLeaves.length,
      pending: employeeLeaves.filter(l => l.status === 'pending').length,
      approved: employeeLeaves.filter(l => l.status === 'approved').length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Directory</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view employee information
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search employees by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 pr-4 py-2 w-full"
            />
            <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="all">All Departments</option>
            {state.departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => {
            const stats = getEmployeeLeaveStats(employee.id);
            
            return (
              <div
                key={employee.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      {employee.department}
                    </div>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      employee.role === 'manager'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {employee.role}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.email}
                  </div>
                  <div className="text-sm">
                    Joined: {new Date(employee.joinDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="text-center">
                      <div className="font-semibold">{stats.total}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                        {stats.pending}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {stats.approved}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Approved</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs font-medium mb-1">Leave Balance</div>
                    <div className="flex space-x-2">
                      {Object.entries(employee.leaveBalance).map(([type, days]) => (
                        <div
                          key={type}
                          className="flex-1 text-center bg-gray-50 dark:bg-gray-700 py-1 rounded"
                        >
                          <div className="font-semibold">{days}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Employees;