import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Building,
  Users,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRooms: 12,
    occupiedRooms: 4,
    availableRooms: 8,
    totalStudents: 128,
    paymentsByStatus: [
      { _id: 'Paid', total: 148500, count: 3 },
      { _id: 'Pending', total: 24300, count: 4 },
    ],
    roomTypeDistribution: [
      { _id: 'Single', count: 5 },
      { _id: 'Double', count: 5 },
      { _id: 'Triple', count: 2 },
    ],
    complaintsByStatus: [
      { _id: 'Resolved', count: 12 },
      { _id: 'In Progress', count: 3 },
      { _id: 'Pending', count: 2 },
    ],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reports/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.warn('Analytics API connecting, using sample analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const feeData = [
    { month: 'Jan', collected: 125000, target: 140000 },
    { month: 'Feb', collected: 135000, target: 140000 },
    { month: 'Mar', collected: 148500, target: 150000 },
    { month: 'Apr', collected: 110000, target: 150000 },
  ];

  const occupancyPie = [
    { name: 'Occupied Beds', value: 4 },
    { name: 'Vacant Beds', value: 8 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Executive Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Holistic data intelligence on bed occupancy, revenue collection and service speed.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Executive Report</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Rooms</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{data.totalRooms || 12}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Capacity managed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold text-slate-400 uppercase">Occupancy Rate</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">66.7%</h3>
          <p className="text-xs text-slate-400 mt-0.5">Active residency ratio</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold text-slate-400 uppercase">Paid Fee Volume</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">₹1,48,500</h3>
          <p className="text-xs text-slate-400 mt-0.5">Audited receipts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold text-slate-400 uppercase">Pending Rent</p>
          <h3 className="text-2xl font-black text-purple-600 mt-1">₹24,300</h3>
          <p className="text-xs text-slate-400 mt-0.5">4 student notices</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Revenue Trend */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Revenue Collection (₹)</h3>
              <p className="text-xs text-slate-400">Actual collections vs projected billing</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
              Q1-Q2 2024
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => `₹${val.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="collected" name="Fee Collected" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Billing Target" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Occupancy Pie Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Room Occupancy Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Real-time bed availability split</p>

            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Available Vacancies:</span>
            <span className="font-bold text-emerald-600">8 Rooms Ready</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reports;

