import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  Bed,
  IndianRupee,
  Calendar,
  AlertCircle,
  Utensils,
  Plus,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Wrench,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    metrics: {
      totalProperties: 12,
      currentTenants: 128,
      vacantRooms: 8,
      pendingPaymentsAmount: 24300,
      paidFeesAmount: 148500,
      occupiedRooms: 16,
    },
    occupancyChartData: [
      { month: 'Jan', occupied: 85, vacant: 30 },
      { month: 'Feb', occupied: 45, vacant: 48 },
      { month: 'Mar', occupied: 88, vacant: 35 },
      { month: 'Apr', occupied: 65, vacant: 140 },
      { month: 'May', occupied: 110, vacant: 50 },
      { month: 'Jun', occupied: 55, vacant: 45 },
      { month: 'Jul', occupied: 105, vacant: 38 },
      { month: 'Aug', occupied: 50, vacant: 52 },
      { month: 'Sep', occupied: 90, vacant: 115 },
    ],
    upcomingDuePayments: [
      {
        id: '1',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        room: 'Room 105',
        amount: 8000,
        dueText: 'Due in 2 Days',
      },
      {
        id: '2',
        name: 'Sneha Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        room: 'Room 202',
        amount: 6500,
        dueText: 'Due in 4 Days',
      },
      {
        id: '3',
        name: 'Amit Verma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        room: 'Room 310',
        amount: 5200,
        dueText: 'Due in 5 Days',
      },
      {
        id: '4',
        name: 'Priya Singh',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        room: 'Room 112',
        amount: 4600,
        dueText: 'Due in 6 Days',
      },
    ],
    recentBookings: [
      {
        id: '1',
        tenantName: 'Arjun Mehta',
        property: 'Green PG',
        checkIn: '10 Apr 2024',
        status: 'Confirmed',
      },
      {
        id: '2',
        tenantName: 'Neha Gupta',
        property: 'City Nest',
        checkIn: '08 Apr 2022',
        status: 'Pending',
      },
      {
        id: '3',
        tenantName: 'Vikram Rao',
        property: 'Sunrise PG',
        checkIn: '05 Apr 2024',
        status: 'Confirmed',
      },
    ],
    maintenanceRequests: [
      {
        id: '1',
        title: 'AC Repair - Building A',
        status: 'In Progress',
      },
      {
        id: '2',
        title: 'Plumbing Issue - Room 203',
        status: 'Pending',
      },
      {
        id: '3',
        title: 'WIFI Problem - 2nd Floor',
        status: 'Resolved',
      },
    ],
    todayMess: null,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard-stats');
      if (res.data.success && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.warn('API connecting or fallback to default sample dataset:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            PG Management <span className="font-semibold text-slate-700">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time occupancy, automated rent alerts & hostel operations overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            title="Refresh Real-time Data"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 shadow-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {(user?.role === 'admin' || user?.role === 'warden') && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/students')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tenant</span>
              </button>
              <button
                onClick={() => navigate('/payments')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 shadow-sm transition"
              >
                <span>Record Fee</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. TOP METRIC CARDS (Matching UI Reference Image Exactly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Properties / Rooms */}
        <DashboardCard
          title="Total Properties"
          value={stats.metrics?.totalProperties ?? 12}
          icon={Building}
          iconBg="bg-amber-100/80"
          iconColor="text-amber-600"
          subtext="Managed Blocks"
        />

        {/* Card 2: Current Tenants / Students */}
        <DashboardCard
          title="Current Tenants"
          value={stats.metrics?.currentTenants ?? 128}
          icon={Users}
          iconBg="bg-emerald-100/80"
          iconColor="text-emerald-600"
          subtext="Active Residents"
        />

        {/* Card 3: Vacant Rooms */}
        <DashboardCard
          title="Vacant Rooms"
          value={stats.metrics?.vacantRooms ?? 8}
          icon={Bed}
          iconBg="bg-blue-100/80"
          iconColor="text-blue-600"
          subtext="Available to Allocate"
        />

        {/* Card 4: Pending Payments */}
        <DashboardCard
          title="Pending Payments"
          value={`₹${(stats.metrics?.pendingPaymentsAmount ?? 24300).toLocaleString()}`}
          icon={IndianRupee}
          iconBg="bg-purple-100/80"
          iconColor="text-purple-600"
          subtext="Due within 7 days"
        />

      </div>

      {/* 2. MIDDLE ROW: Occupancy Overview (Chart) + Upcoming Due Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Occupancy Overview Chart (approx 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Occupancy Overview</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of occupied beds vs vacant vacancies</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              2024 Year
            </span>
          </div>

          {/* Recharts Bar + Line Composed Chart */}
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stats.occupancyChartData || []}
                margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 15, 35, 40, 130, 140]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs font-medium text-slate-600 capitalize">{value}</span>
                  )}
                />
                <Bar
                  dataKey="occupied"
                  name="Occupied"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Line
                  type="monotone"
                  dataKey="vacant"
                  name="Vacant"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Upcoming Due Payments (approx 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Upcoming Due Payments</h3>
              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List matching screenshot: Rahul Sharma - Room 105 - ₹8,000 Due in 2 Days */}
            <div className="space-y-3.5">
              {stats.upcomingDuePayments && stats.upcomingDuePayments.length > 0 ? (
                stats.upcomingDuePayments.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">
                          {item.name}
                          <span className="text-xs font-normal text-slate-400 ml-1.5">• {item.room}</span>
                        </h4>
                        <p className="text-xs font-bold text-blue-600">
                          ₹{item.amount?.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-slate-500">{item.dueText}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/payments')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                      Collect
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No overdue payments found.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Overdue Bucket:</span>
            <span className="font-bold text-slate-800 text-sm">₹{(stats.metrics?.pendingPaymentsAmount ?? 24300).toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM ROW: Recent Bookings Table + Maintenance Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Bookings Table (approx 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Recent Bookings</h3>
            <button
              onClick={() => navigate('/rooms')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage Allocations <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table matching screenshot columns: Tenant Name | Property | Check-In | Status */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium text-xs">
                  <th className="pb-3 font-semibold">Tenant Name</th>
                  <th className="pb-3 font-semibold">Property</th>
                  <th className="pb-3 font-semibold">Check-In</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentBookings && stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-semibold text-slate-800">{b.tenantName}</td>
                      <td className="py-3 text-slate-600">{b.property}</td>
                      <td className="py-3 text-slate-500">{b.checkIn}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-slate-400">
                      No recent bookings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Maintenance Requests (approx 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Maintenance Requests</h3>
              <button
                onClick={() => navigate('/complaints')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View Tickets <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List matching screenshot:
                - AC Repair - Building A -> [In Progress] (green)
                - Plumbing Issue - Room 203 -> [Pending] (purple)
                - WIFI Problem - 2nd Floor -> [Resolved] (blue)
            */}
            <div className="space-y-3">
              {stats.maintenanceRequests && stats.maintenanceRequests.length > 0 ? (
                stats.maintenanceRequests.map((req, i) => {
                  let badgeClass = 'bg-emerald-600 text-white';
                  if (req.status === 'Pending') {
                    badgeClass = 'bg-indigo-600 text-white';
                  } else if (req.status === 'Resolved' || req.status === 'Closed') {
                    badgeClass = 'bg-blue-600 text-white';
                  }

                  return (
                    <div
                      key={req.id || i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition"
                    >
                      <span className="text-xs sm:text-sm font-medium text-slate-800 truncate mr-2">
                        {req.title}
                      </span>
                      <span className={`shrink-0 px-3 py-1 rounded-md text-xs font-semibold ${badgeClass}`}>
                        {req.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No open maintenance requests.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need immediate maintenance?</span>
            <button
              onClick={() => navigate('/complaints')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" /> Log Issue
            </button>
          </div>
        </div>

      </div>

      {/* 4. TODAY'S MESS MENU QUICK PREVIEW BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Utensils className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base sm:text-lg">Today's Dining & Mess Schedule</h4>
              <span className="text-[11px] bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                Fresh & Hygienic
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Lunch: Steamed Basmati Rice, Dal Tadka, Seasonal Veg Curry, Curd & Roti • Dinner: Paneer Butter Masala & Pulao
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/mess')}
          className="shrink-0 px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow transition"
        >
          View Full Weekly Menu
        </button>
      </div>

    </div>
  );
};

export default Dashboard;

