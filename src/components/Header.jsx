import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, UserCircleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useLeave } from '../context/LeaveContext';

const Header = () => {
  const { state, markNotificationRead, switchUser } = useLeave();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const unreadNotifications = state.notifications.filter(
    n => n.userId === state.currentUser?.id && !n.read
  );

  const navigation = [
    { name: 'Dashboard', href: '/', current: location.pathname === '/' },
    { name: 'Calendar', href: '/calendar', current: location.pathname === '/calendar' },
    { name: 'Apply Leave', href: '/apply', current: location.pathname === '/apply' },
    { name: 'My Leaves', href: '/leaves', current: location.pathname === '/leaves' },
    ...(state.currentUser?.role === 'manager' ? [
      { name: 'Approvals', href: '/approvals', current: location.pathname === '/approvals' },
      { name: 'Employees', href: '/employees', current: location.pathname === '/employees' },
    ] : []),
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                HR<span className="text-gray-600 dark:text-gray-300">Leave</span>
              </div>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'border-primary-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
              >
                <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-slide-in">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {state.notifications
                      .filter(n => n.userId === state.currentUser?.id)
                      .slice(0, 5)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{state.currentUser?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {state.currentUser?.role} • {state.currentUser?.department}
                  </p>
                </div>
              </button>

              {showUserSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-slide-in">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Switch User</h3>
                    {state.employees.map((employee) => (
                      <button
                        key={employee.id}
                        onClick={() => {
                          switchUser(employee.id);
                          setShowUserSwitcher(false);
                        }}
                        className={`w-full text-left p-2 rounded mb-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          employee.id === state.currentUser?.id
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : ''
                        }`}
                      >
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.role} • {employee.department}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;