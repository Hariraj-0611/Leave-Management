import React from 'react';
import LeaveApplicationForm from '../components/LeaveApplicationForm';

const ApplyLeave = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Leave</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submit a new leave request
          </p>
        </div>
      </div>
      <LeaveApplicationForm />
    </div>
  );
};

export default ApplyLeave;