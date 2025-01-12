import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, Calendar, Users, FileText, LogOut, PlusCircle } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/doctor-registration', label: 'Register Doctor', icon: PlusCircle },
    { path: '/patient-registration', label: 'Register Patient', icon: UserPlus },
    { path: '/appointment-scheduler', label: 'Appointments', icon: Calendar },
    { path: '/doctor-profiles', label: 'Doctors', icon: Users },
    { path: '/prescription-manager', label: 'Prescriptions', icon: FileText },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Navigation Links */}
        <nav className="py-4">
          <div className="px-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;