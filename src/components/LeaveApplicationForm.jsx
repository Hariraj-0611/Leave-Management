import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useLeave } from '../context/LeaveContext';

const LeaveApplicationForm = () => {
  const navigate = useNavigate();
  const { state, applyLeave } = useLeave();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    watch 
  } = useForm({
    defaultValues: {
      type: 'casual',
      startDate: '2026-01-12',
      endDate: '2026-01-15',
      reason: 'i am going to temple'
    }
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const leaveType = watch('type');

  // Safe calculate function
  const calculateLeaveDays = (start, end) => {
    try {
      if (!start || !end) return 0;
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
      const diffTime = Math.abs(endDate - startDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch (err) {
      console.error('Error calculating leave days:', err);
      return 0;
    }
  };

  // Safe overlap check
  const checkOverlap = (type, start, end) => {
    try {
      if (!start || !end || !state.leaves) return false;
      
      const newStart = new Date(start);
      const newEnd = new Date(end);
      if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) return false;
      
      return state.leaves.some(leave => {
        if (!leave || leave.employeeId !== state.currentUser?.id || leave.type !== type) return false;
        if (leave.status === 'rejected') return false;
        
        try {
          const existingStart = new Date(leave.startDate);
          const existingEnd = new Date(leave.endDate);
          if (isNaN(existingStart.getTime()) || isNaN(existingEnd.getTime())) return false;
          
          return (
            (newStart >= existingStart && newStart <= existingEnd) ||
            (newEnd >= existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          );
        } catch {
          return false;
        }
      });
    } catch (err) {
      console.error('Error checking overlap:', err);
      return false;
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Form submitted with data:', formData);
      
      // Basic validation
      if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const leaveDays = calculateLeaveDays(formData.startDate, formData.endDate);
      console.log('Calculated leave days:', leaveDays);
      
      if (leaveDays <= 0) {
        setError('Invalid dates. End date must be after start date.');
        setLoading(false);
        return;
      }

      // Check for overlap
      if (checkOverlap(formData.type, formData.startDate, formData.endDate)) {
        setError('Leave dates overlap with an existing leave application!');
        setLoading(false);
        return;
      }

      // Prepare leave data
      const leaveData = {
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        employeeId: state.currentUser?.id || 'emp_1',
        employeeName: state.currentUser?.name || 'John Doe',
        status: 'pending',
      };

      console.log('Calling applyLeave with:', leaveData);
      
      // Call applyLeave
      applyLeave(leaveData);
      
      console.log('Leave application successful');
      
      // Show success message
      setSuccess(true);
      reset();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        navigate('/leaves'); // Redirect to My Leaves page
      }, 2000);
      
    } catch (err) {
      console.error('Form submission error:', err);
      setError(`Failed to submit leave application: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const days = calculateLeaveDays(startDate, endDate);
  const balance = leaveType ? (state.currentUser?.leaveBalance?.[leaveType] || 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Apply for Leave</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">
                ⚠️ {error}
              </p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✓ Leave application submitted successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Leave Type *
                </label>
                <select
                  {...register('type', { required: 'Leave type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Leave Summary
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {days} day{days !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {leaveType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {balance} days
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    {...register('startDate', { 
                      required: 'Start date is required',
                      validate: value => {
                        try {
                          const today = new Date().toISOString().split('T')[0];
                          return value >= today || 'Start date cannot be in the past';
                        } catch {
                          return 'Invalid date';
                        }
                      }
                    })}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  End Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    {...register('endDate', { 
                      required: 'End date is required',
                      validate: value => {
                        try {
                          if (!startDate) return true;
                          return value >= startDate || 'End date must be after start date';
                        } catch {
                          return 'Invalid date';
                        }
                      }
                    })}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Reason *
              </label>
              <textarea
                {...register('reason', { 
                  required: 'Reason is required',
                  minLength: { value: 3, message: 'Reason must be at least 3 characters' }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Please provide a reason for your leave..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  reset({
                    type: 'casual',
                    startDate: '',
                    endDate: '',
                    reason: ''
                  });
                  setError('');
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Debug info - remove in production */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <details>
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">Debug Info</summary>
            <pre className="text-xs mt-2 text-gray-600 dark:text-gray-400">
              Current User: {JSON.stringify(state.currentUser, null, 2)}
              <br/>
              Balance: {balance}
              <br/>
              Leave Days: {days}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;