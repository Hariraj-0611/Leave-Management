import React from 'react';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import DashboardCharts from '../components/DashboardCharts';
import LeaveCalendar from '../components/LeaveCalendar';
import { useLeave } from '../context/LeaveContext';
import { ArrowUpIcon, ArrowDownIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { state } = useLeave();
  
  const stats = [
    {
      name: 'Total Leaves This Month',
      value: state.leaves.filter(l => {
        const leaveDate = new Date(l.startDate);
        const now = new Date();
        return leaveDate.getMonth() === now.getMonth() && leaveDate.getFullYear() === now.getFullYear();
      }).length,
      change: '+12%',
      trend: 'up',
      icon: ArrowUpIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Approvals',
      value: state.leaves.filter(l => l.status === 'pending').length,
      change: state.currentUser?.role === 'manager' ? '3 to review' : 'Awaiting',
      trend: 'neutral',
      icon: UserGroupIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Team Coverage',
      value: '85%',
      change: '+5%',
      trend: 'up',
      icon: ArrowUpIcon,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {state.currentUser?.name}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className={`flex items-center mt-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                    stat.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {stat.trend === 'up' && <ArrowUpIcon className="h-4 w-4 mr-1" />}
                    {stat.trend === 'down' && <ArrowDownIcon className="h-4 w-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <LeaveBalanceCard />
      <DashboardCharts />
      <LeaveCalendar />
    </div>
  );
};

export default Dashboard;