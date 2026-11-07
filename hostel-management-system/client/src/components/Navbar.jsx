import React, { useState } from 'react';
import { Bell, Menu, X, User, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#2563eb] text-white shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3.5">
        
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            {/* Colorful Logo Mark matching the reference image */}
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#06b6d4" strokeWidth="2.5" />
                <path d="M7 12a5 5 0 0 1 10 0" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2.5" fill="#f59e0b" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              ima-appweb
            </span>
          </div>
        </div>

        {/* Center: Welcome Heading matching image */}
        <div className="hidden md:flex items-center justify-center">
          <h2 className="text-lg lg:text-xl font-medium tracking-wide text-white/95">
            Welcome, <span className="font-bold text-white capitalize">{user?.role || 'Admin'}</span>!
          </h2>
        </div>

        {/* Right: Alerts & User Profile */}
        <div className="flex items-center gap-4">
          
          {/* Alerts Bell Button */}
          <div className="relative">
            <button
              onClick={() => setAlertsOpen(!alertsOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition focus:outline-none"
            >
              <div className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wider">Alerts</span>
              <span className="text-xs bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">4</span>
            </button>

            {/* Alerts Dropdown Modal */}
            {alertsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 text-slate-800 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-800">Pending Notifications</h4>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">4 New</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                  <div className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800">Rahul Sharma - ₹8,000</p>
                    <p className="text-rose-500">Hostel Fee Due in 2 Days (Room 105)</p>
                  </div>
                  <div className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800">Sneha Patel - ₹6,500</p>
                    <p className="text-amber-600">Single Room Fee Due in 4 Days</p>
                  </div>
                  <div className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800">AC Repair - Building A</p>
                    <p className="text-emerald-600">Work In Progress by Technician</p>
                  </div>
                  <div className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800">New Visitor Logged</p>
                    <p className="text-slate-500">Rajesh Mehta visiting Room 101</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-white/40 transition focus:outline-none"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80"
              />
              <ChevronDown className="w-3.5 h-3.5 text-white/80 hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 text-slate-800 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-sm text-slate-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                    {user?.role || 'Guest'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" /> My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;

