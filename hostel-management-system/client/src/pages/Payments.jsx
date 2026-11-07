import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  IndianRupee,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  FileText,
  User,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Payments = () => {
  const { user, isAdmin, isWarden, isStudent } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Forms
  const [newFee, setNewFee] = useState({
    studentId: '',
    title: 'Monthly Hostel Fee',
    amount: 8000,
    month: 'April 2024',
    dueDate: '',
    remarks: '',
  });

  const [paymentCollect, setPaymentCollect] = useState({
    paymentMethod: 'UPI',
    transactionId: '',
    remarks: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
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
    fetchPayments();
    if (!isStudent) fetchStudents();
  }, []);

  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/payments', newFee);
      if (res.data.success) {
        setShowAddModal(false);
        setNewFee({
          studentId: '',
          title: 'Monthly Hostel Fee',
          amount: 8000,
          month: 'April 2024',
          dueDate: '',
          remarks: '',
        });
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating invoice');
    }
  };

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!selectedPayment) return;
    try {
      const res = await api.put(`/payments/${selectedPayment._id}/pay`, paymentCollect);
      if (res.data.success) {
        setShowPayModal(false);
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording payment');
    }
  };

  // Calculations
  const totalPaid = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status !== 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    const studentName = p.student ? p.student.name.toLowerCase() : '';
    const invoice = p.invoiceNumber ? p.invoiceNumber.toLowerCase() : '';
    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) || invoice.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Fee & Payment Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track student billing cycles, pending dues, collect UPI/Card payments and generate invoices.
          </p>
        </div>

        {(isAdmin || isWarden) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Fee Invoice</span>
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Collected (Paid)</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{totalPaid.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cleared transactions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Dues</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">₹{totalPending.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Awaiting fee clearance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invoices</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{payments.length}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Recorded fee records</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, invoice number..."
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
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading payment ledger...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No payment invoices match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Fee Month</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const isPaid = p.status === 'Paid';
                  const dueDateStr = new Date(p.dueDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                        {p.invoiceNumber || 'INV-001'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.student?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={p.student?.name || 'Student'}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{p.student?.name || 'Resident Student'}</p>
                            <p className="text-xs text-slate-400">{p.room ? `Room ${p.room.roomNumber}` : 'Room 101'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">{p.month}</td>

                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ₹{p.amount?.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">{dueDateStr}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid ? (
                            <button
                              onClick={() => {
                                setSelectedPayment(p);
                                setShowPayModal(true);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                            >
                              Collect / Pay
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedPayment(p);
                                setShowReceiptModal(true);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" /> Receipt
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

      {/* MODAL: CREATE FEE INVOICE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Generate Fee Invoice</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateFee} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student *</label>
                <select
                  required
                  value={newFee.studentId}
                  onChange={(e) => setNewFee({ ...newFee, studentId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose a Student --</option>
                  {students.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} ({st.studentId || st.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Fee Description</label>
                <input
                  type="text"
                  required
                  value={newFee.title}
                  onChange={(e) => setNewFee({ ...newFee, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={newFee.amount}
                    onChange={(e) => setNewFee({ ...newFee, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Billing Month</label>
                  <input
                    type="text"
                    value={newFee.month}
                    onChange={(e) => setNewFee({ ...newFee, month: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={newFee.dueDate}
                  onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })}
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
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COLLECT / RECORD PAYMENT */}
      {showPayModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Record Fee Collection</h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-900 space-y-1">
              <p><span className="font-semibold">Student:</span> {selectedPayment.student?.name}</p>
              <p><span className="font-semibold">Invoice:</span> {selectedPayment.invoiceNumber}</p>
              <p className="text-sm font-bold text-blue-700">Amount Due: ₹{selectedPayment.amount?.toLocaleString()}</p>
            </div>

            <form onSubmit={handleCollectPayment} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentCollect.paymentMethod}
                  onChange={(e) => setPaymentCollect({ ...paymentCollect, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash at Hostel Office</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Credit/Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref / Receipt No</label>
                <input
                  type="text"
                  placeholder="e.g. UPI8934271891"
                  value={paymentCollect.transactionId}
                  onChange={(e) => setPaymentCollect({ ...paymentCollect, transactionId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Received full monthly installment"
                  value={paymentCollect.remarks}
                  onChange={(e) => setPaymentCollect({ ...paymentCollect, remarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW OFFICIAL RECEIPT */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Fee Payment Receipt</h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 border border-dashed border-slate-200 rounded-2xl my-4 text-xs space-y-3 bg-slate-50/50">
              <div className="text-center pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Hostel Management Portal</h4>
                <p className="text-[11px] text-slate-400">Official Payment Acknowledgement Receipt</p>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Receipt No:</span>
                <span className="font-mono font-bold">{selectedPayment.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-800">{selectedPayment.student?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Period:</span>
                <span className="font-semibold">{selectedPayment.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-semibold">{selectedPayment.paymentMethod || 'UPI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Txn ID:</span>
                <span className="font-mono">{selectedPayment.transactionId || 'TXN-HOSTEL-001'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-bold text-slate-700">Amount Cleared:</span>
                <span className="font-black text-emerald-600">₹{selectedPayment.amount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Print / Download
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;

