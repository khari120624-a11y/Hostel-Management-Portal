import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Clock,
  Phone,
  User,
  LogOut,
  CheckCircle2,
  Calendar,
  Trash2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Visitors = () => {
  const { user, isAdmin, isWarden } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    relation: 'Parent / Guardian',
    phone: '',
    studentId: '',
    purpose: 'Personal Visit',
    idProof: 'Aadhaar / Gov ID',
    remarks: '',
  });

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/visitors');
      if (res.data.success) {
        setVisitors(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchVisitors();
    fetchStudents();
  }, []);

  const handleCreateVisitor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/visitors', newVisitor);
      if (res.data.success) {
        setShowAddModal(false);
        setNewVisitor({
          visitorName: '',
          relation: 'Parent / Guardian',
          phone: '',
          studentId: '',
          purpose: 'Personal Visit',
          idProof: 'Aadhaar / Gov ID',
          remarks: '',
        });
        fetchVisitors();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording visitor');
    }
  };

  const handleCheckout = async (id) => {
    try {
      const res = await api.put(`/visitors/${id}/checkout`);
      if (res.data.success) {
        fetchVisitors();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error checking out visitor');
    }
  };

  const handleDeleteVisitor = async (id) => {
    if (!window.confirm('Delete this visitor log?')) return;
    try {
      const res = await api.delete(`/visitors/${id}`);
      if (res.data.success) {
        fetchVisitors();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting log');
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Campus Visitor Register
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log physical check-ins, verify identity proofs and maintain campus resident security.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Visitor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search visitor, student name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Visitors</option>
            <option value="In Premises">In Premises</option>
            <option value="Checked Out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading visitor logs...</div>
        ) : filteredVisitors.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No visitor records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Visitor</th>
                  <th className="py-3.5 px-4">Relation</th>
                  <th className="py-3.5 px-4">Student Visited</th>
                  <th className="py-3.5 px-4">Check-In Time</th>
                  <th className="py-3.5 px-4">Check-Out Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.map((v) => {
                  const inPremises = v.status === 'In Premises';
                  const inTimeStr = new Date(v.checkInTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const outTimeStr = v.checkOutTime
                    ? new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--';

                  return (
                    <tr key={v._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{v.visitorName}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {v.phone}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{v.relation}</td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{v.studentName}</p>
                        <p className="text-xs text-slate-400">Room {v.roomNumber || '101'}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{inTimeStr}</td>

                      <td className="py-3.5 px-4 text-slate-500">{outTimeStr}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            inPremises ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inPremises && (
                            <button
                              onClick={() => handleCheckout(v._id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Check Out
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteVisitor(v._id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: LOG VISITOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Log Campus Visitor</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Mehta"
                  value={newVisitor.visitorName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Relation</label>
                  <select
                    value={newVisitor.relation}
                    onChange={(e) => setNewVisitor({ ...newVisitor, relation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother / Sister">Brother / Sister</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Student Being Visited *</label>
                <select
                  required
                  value={newVisitor.studentId}
                  onChange={(e) => setNewVisitor({ ...newVisitor, studentId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} {st.room ? `(Room ${st.room.roomNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Delivering study supplies / Weekend greeting"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Visitors;

