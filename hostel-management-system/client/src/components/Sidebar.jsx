import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  CreditCard,
  Wrench,
  UtensilsCrossed,
  Sparkles,
  UserCheck,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation Links matching user screenshot + module specs
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', path: '/rooms', icon: Building2 },
    { name: 'Tenants', path: '/students', icon: Users },
    { name: 'Bookings', path: '/rooms?tab=allocations', icon: CalendarCheck },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Maintenance', path: '/complaints', icon: Wrench },
    { name: 'Mess & Food', path: '/mess', icon: UtensilsCrossed },
    { name: 'Amenities', path: '/amenities', icon: Sparkles },
    { name: 'Visitors', path: '/visitors', icon: UserCheck, roles: ['admin', 'warden'] },
    { name: 'Staff Team', path: '/team', icon: ShieldCheck, roles: ['admin', 'warden'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['admin', 'warden'] },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container with sleek royal blue aesthetic matching screenshot */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl`}
      >
        {/* Top spacer / Header in mobile view */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-600 font-extrabold text-sm">PG</span>
            </div>
            <span className="font-bold text-lg text-white">ima-appweb</span>
          </div>
          <button onClick={closeSidebar} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        {/* Decorative subtle wavy background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,40 70,60 100,20 L100,100 L0,100 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10">
          {navLinks.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) {
              return null;
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) closeSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm font-bold'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: Settings & Logout */}
        <div className="p-3 border-t border-white/10 space-y-1 relative z-10">
          <button
            onClick={() => alert('Hostel System Settings: System version 1.0.0. All configurations active.')}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-200 hover:text-white hover:bg-rose-500/20 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

