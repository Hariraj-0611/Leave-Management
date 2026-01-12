import React from 'react';
import { CalendarDaysIcon, HeartIcon, SunIcon } from '@heroicons/react/24/outline';
import { useLeave } from '../context/LeaveContext';

const LeaveBalanceCard = () => {
  const { state } = useLeave();
  const balance = state.currentUser?.leaveBalance || { annual: 0, sick: 0, casual: 0 };

  const balanceItems = [
    {
      type: 'annual',
      label: 'Annual Leave',
      icon: SunIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      type: 'sick',
      label: 'Sick Leave',
      icon: HeartIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      type: 'casual',
      label: 'Casual Leave',
      icon: CalendarDaysIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Leave Balance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balanceItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              className={`${item.bgColor} rounded-lg p-4 transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${item.textColor}`} />
                </div>
                <span className={`text-2xl font-bold ${item.textColor}`}>
                  {balance[item.type]}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Days remaining
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveBalanceCard;