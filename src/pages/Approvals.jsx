import React from 'react';
import LeaveList from '../components/LeaveList';
import { useLeave } from '../context/LeaveContext';

const Approvals = () => {
  const { state } = useLeave();
  
  if (state.currentUser?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Restricted
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manager access required to view approval requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage leave requests from your team
          </p>
        </div>
      </div>
      <LeaveList mode="approval" />
    </div>
  );
};

export default Approvals;