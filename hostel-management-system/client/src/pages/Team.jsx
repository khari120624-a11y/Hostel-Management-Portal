import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  Clock,
  Plus,
  Trash2,
  Edit,
  BadgeCheck,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Team = () => {
  const { user, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default fallback staff roster
  const defaultStaff = [
    {
      _id: '1',
      name: 'Admin Supervisor',
      email: 'admin@hostel.com',
      role: 'admin',
      phone: '+91 98765 00001',
      department: 'Hostel Administration',
      shift: '09:00 AM - 06:00 PM',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      _id: '2',
      name: 'Ramesh Sharma (Chief Warden)',
      email: 'warden@hostel.com',
      role: 'warden',
      phone: '+91 98765 00002',
      department: 'Student Affairs & Allocations',
      shift: 'Day Shift (08:00 AM - 05:00 PM)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      _id: '3',
      name: 'Dr. Meena Iyer (Deputy Warden)',
      email: 'meena.warden@hostel.com',
      role: 'warden',
      phone: '+91 98765 00003',
      department: 'Girls Wing & Mess Supervision',
      shift: 'Evening Shift (01:00 PM - 09:00 PM)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      _id: '4',
      name: 'Vikram Singh (Chief Security Guard)',
      email: 'security@hostel.com',
      role: 'warden',
      phone: '+91 98765 00004',
      department: 'Main Gate Security & Access Control',
      shift: '24/7 Rotational Watch',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/users');
      if (res.data.success && res.data.data) {
        // filter out student accounts for the staff team roster
        const staffOnly = res.data.data.filter((u) => u.role !== 'student');
        setUsersList(staffOnly.length > 0 ? staffOnly : defaultStaff);
      } else {
        setUsersList(defaultStaff);
      }
    } catch (err) {
      setUsersList(defaultStaff);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Hostel Staff & Wardens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Directory of executive management, wardens, security supervisors and maintenance personnel.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {usersList.map((st) => (
          <div
            key={st._id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition text-center flex flex-col justify-between"
          >
            <div>
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={st.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-blue-50"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-base">{st.name}</h3>
              <p className="text-xs font-semibold text-blue-600 capitalize mt-0.5">{st.role} • Staff</p>

              <div className="space-y-2 text-xs text-slate-600 pt-4 mt-3 border-t border-slate-100 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{st.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{st.phone || '+91 98765 00000'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{st.shift || '09:00 AM - 06:00 PM'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="inline-block w-full py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-xl text-xs">
                Active Staff Member
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Team;

