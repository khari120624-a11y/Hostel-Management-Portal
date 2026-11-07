import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  User,
  MapPin,
  Trash2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
  const { user, isAdmin, isWarden, isStudent } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Form states
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: 'Plumbing Issue',
    location: 'Building A',
    description: '',
    priority: 'Medium',
  });

  const [updateStatusData, setUpdateStatusData] = useState({
    status: 'In Progress',
    assignedTo: '',
    resolutionNotes: '',
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/complaints', newComplaint);
      if (res.data.success) {
        setShowAddModal(false);
        setNewComplaint({
          title: '',
          category: 'Plumbing Issue',
          location: 'Building A',
          description: '',
          priority: 'Medium',
        });
        fetchComplaints();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      const res = await api.put(`/complaints/${selectedComplaint._id}`, updateStatusData);
      if (res.data.success) {
        setShowUpdateModal(false);
        setSelectedComplaint(null);
        fetchComplaints();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating complaint');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint ticket?')) return;
    try {
      const res = await api.delete(`/complaints/${id}`);
      if (res.data.success) {
        fetchComplaints();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting ticket');
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Maintenance & Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lodge facility requests, track resolution progress and assign maintenance engineers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge Maintenance Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Plumbing Issue">Plumbing Issue</option>
            <option value="WiFi Problem">WiFi Problem</option>
            <option value="Electrical">Electrical</option>
            <option value="Cleanliness">Cleanliness</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing {filteredComplaints.length} tickets
        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading maintenance tickets...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
          No maintenance requests found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComplaints.map((c) => {
            let statusBadge = 'bg-emerald-600 text-white';
            if (c.status === 'Pending') statusBadge = 'bg-indigo-600 text-white';
            if (c.status === 'Resolved' || c.status === 'Closed') statusBadge = 'bg-blue-600 text-white';

            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Title & Status Pill */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-slate-800 text-base leading-snug">
                      {c.title}
                    </h3>
                    <span className={`shrink-0 px-2.5 py-0.5 rounded-md text-xs font-bold ${statusBadge}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.location || 'Building A'}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{c.category}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {c.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Raised By:</span>
                      <span className="font-semibold text-slate-700">{c.studentName || 'Resident'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned To:</span>
                      <span className="font-semibold text-slate-700">{c.assignedTo || 'Maintenance Desk'}</span>
                    </div>
                    {c.resolutionNotes && (
                      <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg">
                        <span className="font-bold block">Resolution:</span> {c.resolutionNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {(isAdmin || isWarden) && (
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setUpdateStatusData({
                            status: c.status,
                            assignedTo: c.assignedTo || 'Maintenance Desk',
                            resolutionNotes: c.resolutionNotes || '',
                          });
                          setShowUpdateModal(true);
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                      >
                        Update
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteComplaint(c._id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: LODGE COMPLAINT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Lodge Maintenance Request</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Repair, Plumbing Leak, WiFi Loss"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AC Repair">AC Repair</option>
                    <option value="Plumbing Issue">Plumbing Issue</option>
                    <option value="WiFi Problem">WiFi Problem</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Mess / Food">Mess / Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Location / Room *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 203, Building A"
                    value={newComplaint.location}
                    onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain the problem clearly..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
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
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE TICKET STATUS */}
      {showUpdateModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Update Ticket Status</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select
                  value={updateStatusData.status}
                  onChange={(e) => setUpdateStatusData({ ...updateStatusData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Technician / Staff</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh (HVAC Tech)"
                  value={updateStatusData.assignedTo}
                  onChange={(e) => setUpdateStatusData({ ...updateStatusData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Resolution Remarks</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Replaced faulty component. Verified working."
                  value={updateStatusData.resolutionNotes}
                  onChange={(e) => setUpdateStatusData({ ...updateStatusData, resolutionNotes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Complaints;

