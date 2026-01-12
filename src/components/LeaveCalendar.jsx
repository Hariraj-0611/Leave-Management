import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useLeave } from '../context/LeaveContext';

const LeaveCalendar = () => {
  const { state } = useLeave();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getLeavesForDay = (day) => {
    return state.leaves.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return day >= start && day <= end;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'rejected': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getLeaveTypeColor = (type) => {
    return state.leaveTypes[type]?.color.split(' ')[0];
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 p-1 border border-gray-200 dark:border-gray-700 rounded"></div>
        ))}

        {monthDays.map((day) => {
          const dayLeaves = getLeavesForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toString()}
              className={`h-24 p-1 border border-gray-200 dark:border-gray-700 rounded overflow-y-auto ${
                !isSameMonth(day, currentMonth) ? 'bg-gray-50 dark:bg-gray-800/50' : ''
              } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${
                  !isSameMonth(day, currentMonth) ? 'text-gray-400' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                {dayLeaves.length > 0 && (
                  <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full">
                    {dayLeaves.length}
                  </span>
                )}
              </div>
              
              <div className="mt-1 space-y-1">
                {dayLeaves.slice(0, 2).map((leave) => (
                  <div
                    key={leave.id}
                    className={`text-xs p-1 rounded truncate ${getLeaveTypeColor(leave.type)} opacity-90`}
                    title={`${leave.employeeName}: ${state.leaveTypes[leave.type].name}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(leave.status)}`}></div>
                      <span className="truncate">{leave.employeeName.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
                {dayLeaves.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{dayLeaves.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm">Annual Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm">Sick Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="text-sm">Casual Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;