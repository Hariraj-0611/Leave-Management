import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLeave } from '../context/LeaveContext';

const DashboardCharts = () => {
  const { state } = useLeave();

  // Prepare data for department-wise leaves
  const departmentData = state.departments.map(dept => {
    const deptEmployees = state.employees.filter(emp => emp.department === dept);
    const deptLeaves = state.leaves.filter(leave => 
      deptEmployees.some(emp => emp.id === leave.employeeId)
    );
    
    return {
      name: dept,
      leaves: deptLeaves.length,
      pending: deptLeaves.filter(l => l.status === 'pending').length,
      approved: deptLeaves.filter(l => l.status === 'approved').length,
    };
  });

  // Prepare data for leave type distribution
  const leaveTypeData = Object.entries(state.leaveTypes).map(([type, info]) => ({
    name: info.name,
    value: state.leaves.filter(l => l.type === type).length,
    color: info.color.split(' ')[0],
  }));

  const statusData = [
    { name: 'Approved', value: state.leaves.filter(l => l.status === 'approved').length, color: '#10b981' },
    { name: 'Pending', value: state.leaves.filter(l => l.status === 'pending').length, color: '#f59e0b' },
    { name: 'Rejected', value: state.leaves.filter(l => l.status === 'rejected').length, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Leaves by Department</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                  color: '#111827'
                }}
              />
              <Legend />
              <Bar dataKey="leaves" name="Total Leaves" fill="#3b82f6" />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
              <Bar dataKey="approved" name="Approved" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Leave Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Approval Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {statusData.map((status) => (
              <div key={status.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span>{status.name}</span>
                </div>
                <span className="font-semibold">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;