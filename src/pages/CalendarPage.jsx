import React from 'react';
import LeaveCalendar from '../components/LeaveCalendar';

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all leave schedules
          </p>
        </div>
      </div>
      <LeaveCalendar />
    </div>
  );
};

export default CalendarPage;