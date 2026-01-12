import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Papa from 'papaparse';

const initialState = {
  employees: [],
  leaves: [],
  currentUser: null,
  notifications: [],
  departments: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'],
  leaveTypes: {
    annual: { name: 'Annual Leave', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    sick: { name: 'Sick Leave', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    casual: { name: 'Casual Leave', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  },
  darkMode: false,
};

const LeaveContext = createContext();

const calculateLeaveDays = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  } catch (error) {
    console.error('Error calculating leave days:', error);
    return 0;
  }
};

const leaveReducer = (state, action) => {
  console.log('Reducer action:', action.type, action.payload);
  
  try {
    switch (action.type) {
      case 'INITIALIZE_DATA':
        return { ...state, ...action.payload };
      
      case 'APPLY_LEAVE': {
        // Safely calculate leave days
        const leaveDays = calculateLeaveDays(action.payload.startDate, action.payload.endDate);
        
        // Create new leave with safe defaults
        const newLeave = {
          ...action.payload,
          id: `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          appliedDate: new Date().toISOString(),
          status: 'pending',
        };
        
        console.log('Creating new leave:', newLeave);
        
        // Find the employee safely
        const employee = state.employees.find(emp => emp.id === action.payload.employeeId);
        
        // Update employee balance ONLY if employee exists and has balance
        const updatedEmployees = state.employees.map(emp => {
          if (emp.id === action.payload.employeeId && emp.leaveBalance && emp.leaveBalance[action.payload.type] !== undefined) {
            const currentBalance = emp.leaveBalance[action.payload.type] || 0;
            return {
              ...emp,
              leaveBalance: {
                ...emp.leaveBalance,
                [action.payload.type]: Math.max(0, currentBalance - leaveDays)
              }
            };
          }
          return emp;
        });
        
        // Create notification for manager only if manager exists
        let managerNotification = null;
        if (employee && employee.managerId) {
          managerNotification = {
            id: `notif_${Date.now()}`,
            userId: employee.managerId,
            message: `${employee.name} has applied for ${state.leaveTypes[action.payload.type]?.name || action.payload.type} leave`,
            type: 'info',
            read: false,
            createdAt: new Date().toISOString(),
          };
        }
        
        return {
          ...state,
          leaves: [...state.leaves, newLeave],
          employees: updatedEmployees,
          notifications: managerNotification ? [...state.notifications, managerNotification] : state.notifications,
        };
      }
      
      case 'UPDATE_LEAVE_STATUS': {
        const updatedLeaves = state.leaves.map(leave =>
          leave.id === action.payload.leaveId
            ? { 
                ...leave, 
                status: action.payload.status,
                approvedBy: action.payload.approvedBy,
                approvedDate: new Date().toISOString(),
              }
            : leave
        );
        
        const leave = state.leaves.find(l => l.id === action.payload.leaveId);
        if (!leave) return state;
        
        const userNotification = {
          id: `notif_${Date.now()}`,
          userId: leave.employeeId,
          message: `Your ${state.leaveTypes[leave.type]?.name || leave.type} leave has been ${action.payload.status}`,
          type: action.payload.status === 'approved' ? 'success' : 'error',
          read: false,
          createdAt: new Date().toISOString(),
        };
        
        return {
          ...state,
          leaves: updatedLeaves,
          notifications: [...state.notifications, userNotification],
        };
      }
      
      case 'MARK_NOTIFICATION_READ':
        return {
          ...state,
          notifications: state.notifications.map(notif =>
            notif.id === action.payload ? { ...notif, read: true } : notif
          ),
        };
      
      case 'TOGGLE_DARK_MODE':
        const newDarkMode = !state.darkMode;
        // Apply dark mode to document
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { ...state, darkMode: newDarkMode };
      
      case 'SWITCH_USER':
        const user = state.employees.find(emp => emp.id === action.payload);
        if (user) {
          return { ...state, currentUser: user };
        }
        return state;
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Reducer error:', error);
    return state;
  }
};

export const LeaveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveReducer, initialState);

  useEffect(() => {
    // Load initial data from localStorage or initialize with sample data
    const savedData = localStorage.getItem('leaveManagementData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'INITIALIZE_DATA', payload: parsedData });
        
        // Apply dark mode if saved
        if (parsedData.darkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        initializeSampleData();
      }
    } else {
      initializeSampleData();
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever state changes
    try {
      localStorage.setItem('leaveManagementData', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state]);

  const initializeSampleData = () => {
    const sampleEmployees = [
      {
        id: 'emp_1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        role: 'employee',
        managerId: 'emp_3',
        joinDate: '2023-01-15',
        leaveBalance: { annual: 18, sick: 10, casual: 15 }, // Increased casual leave
      },
      {
        id: 'emp_2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'Marketing',
        role: 'employee',
        managerId: 'emp_4',
        joinDate: '2022-06-01',
        leaveBalance: { annual: 12, sick: 7, casual: 10 }, // Increased casual leave
      },
      {
        id: 'emp_3',
        name: 'Robert Johnson',
        email: 'robert.j@company.com',
        department: 'Engineering',
        role: 'manager',
        managerId: null,
        joinDate: '2021-03-10',
        leaveBalance: { annual: 20, sick: 12, casual: 10 },
      },
      {
        id: 'emp_4',
        name: 'Sarah Williams',
        email: 'sarah.w@company.com',
        department: 'Marketing',
        role: 'manager',
        managerId: null,
        joinDate: '2020-11-20',
        leaveBalance: { annual: 22, sick: 15, casual: 12 },
      },
    ];

    const sampleLeaves = [
      {
        id: 'leave_1',
        employeeId: 'emp_1',
        employeeName: 'John Doe',
        type: 'annual',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Family vacation',
        status: 'approved',
        appliedDate: '2024-01-15T10:30:00Z',
        approvedBy: 'emp_3',
        approvedDate: '2024-01-16T14:20:00Z',
      },
      {
        id: 'leave_2',
        employeeId: 'emp_2',
        employeeName: 'Jane Smith',
        type: 'sick',
        startDate: '2024-02-10',
        endDate: '2024-02-10',
        reason: 'Medical appointment',
        status: 'pending',
        appliedDate: '2024-02-05T09:15:00Z',
      },
    ];

    dispatch({
      type: 'INITIALIZE_DATA',
      payload: {
        ...initialState,
        employees: sampleEmployees,
        leaves: sampleLeaves,
        currentUser: sampleEmployees[0], // Default to John Doe
      },
    });
  };

  const applyLeave = (leaveData) => {
    console.log('applyLeave called with:', leaveData);
    dispatch({ type: 'APPLY_LEAVE', payload: leaveData });
  };

  const updateLeaveStatus = (leaveId, status) => {
    dispatch({
      type: 'UPDATE_LEAVE_STATUS',
      payload: { 
        leaveId, 
        status, 
        approvedBy: state.currentUser?.id || 'system' 
      },
    });
  };

  const markNotificationRead = (notificationId) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const switchUser = (userId) => {
    dispatch({ type: 'SWITCH_USER', payload: userId });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const exportToCSV = () => {
    try {
      const csvData = state.leaves.map(leave => ({
        'Employee Name': leave.employeeName || 'Unknown',
        'Leave Type': state.leaveTypes[leave.type]?.name || leave.type,
        'Start Date': leave.startDate || 'N/A',
        'End Date': leave.endDate || 'N/A',
        'Reason': leave.reason || 'N/A',
        'Status': leave.status || 'N/A',
        'Applied Date': leave.appliedDate || 'N/A',
        'Approved Date': leave.approvedDate || 'N/A',
      }));
      
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leave_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        state,
        applyLeave,
        updateLeaveStatus,
        markNotificationRead,
        switchUser,
        exportToCSV,
        toggleDarkMode,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};