import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Wrench,
  UserPlus,
  UserMinus,
  Trash2,
  Edit,
  Bed,
  IndianRupee,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Rooms = () => {
  const { user, isAdmin, isWarden } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form states
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    block: 'Green PG Wing A',
    floor: 1,
    type: 'Double',
    capacity: 2,
    pricePerMonth: 8000,
    amenities: 'Attached Washroom, Study Table, Cupboard, WiFi',
    description: '',
  });

  const [allocationData, setAllocationData] = useState({
    studentId: '',
    bedNumber: 1,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      if (res.data.success) {
        setStudentsList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchStudents();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRoom,
        floor: Number(newRoom.floor),
        capacity: Number(newRoom.capacity),
        pricePerMonth: Number(newRoom.pricePerMonth),
        amenities: newRoom.amenities.split(',').map((s) => s.trim()),
      };
      const res = await api.post('/rooms', payload);
      if (res.data.success) {
        setShowAddModal(false);
        setNewRoom({
          roomNumber: '',
          block: 'Green PG Wing A',
          floor: 1,
          type: 'Double',
          capacity: 2,
          pricePerMonth: 8000,
          amenities: 'Attached Washroom, Study Table, Cupboard, WiFi',
          description: '',
        });
        fetchRooms();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding room');
    }
  };

  const handleAllocateStudent = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !allocationData.studentId) return;
    try {
      const res = await api.post(`/rooms/${selectedRoom._id}/allocate`, allocationData);
      if (res.data.success) {
        setShowAllocateModal(false);
        setSelectedRoom(null);
        setAllocationData({ studentId: '', bedNumber: 1 });
        fetchRooms();
        fetchStudents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error allocating student');
    }
  };

  const handleDeallocateStudent = async (roomId, studentId) => {
    if (!window.confirm('Are you sure you want to deallocate this student from the room?')) return;
    try {
      const res = await api.post(`/rooms/${roomId}/deallocate`, { studentId });
      if (res.data.success) {
        fetchRooms();
        fetchStudents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deallocating student');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      const res = await api.delete(`/rooms/${id}`);
      if (res.data.success) {
        fetchRooms();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting room');
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = filterBlock === 'All' || r.block === filterBlock;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Room & Property Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View room capacities, manage student bed allocations and track occupancy status.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Room</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room number, wing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Wings / Blocks</option>
            <option value="Green PG Wing A">Green PG Wing A</option>
            <option value="City Nest Wing B">City Nest Wing B</option>
            <option value="Sunrise PG Wing C">Sunrise PG Wing C</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available / Vacant</option>
            <option value="full">Full / Occupied</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Room Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading rooms...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
          No rooms match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const isFull = room.occupiedCount >= room.capacity;
            const isAvailable = room.status === 'available';

            return (
              <div
                key={room._id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Room Number & Status Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {room.roomNumber}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">Room {room.roomNumber}</h3>
                        <p className="text-xs text-slate-400">{room.block}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        room.status === 'maintenance'
                          ? 'bg-amber-100 text-amber-700'
                          : isFull
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {room.status === 'maintenance'
                        ? 'Maintenance'
                        : isFull
                        ? 'Occupied'
                        : 'Available'}
                    </span>
                  </div>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-3 border-y border-slate-100 mb-3">
                    <div>
                      <span className="text-slate-400">Type:</span> <span className="font-semibold">{room.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Floor:</span> <span className="font-semibold">{room.floor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Capacity:</span> <span className="font-semibold">{room.capacity} Beds</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Monthly Rent:</span>{' '}
                      <span className="font-bold text-blue-600">₹{room.pricePerMonth?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Occupancy</span>
                      <span className="font-bold text-slate-700">
                        {room.occupiedCount || 0} / {room.capacity} Beds
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFull ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, ((room.occupiedCount || 0) / room.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Allocated Students List */}
                  <div className="space-y-2 mb-4">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      Allocated Students
                    </p>
                    {room.students && room.students.length > 0 ? (
                      <div className="space-y-1.5">
                        {room.students.map((st) => (
                          <div
                            key={st._id}
                            className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img
                                src={st.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt={st.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-medium text-slate-700 truncate">{st.name}</span>
                            </div>

                            {(isAdmin || isWarden) && (
                              <button
                                onClick={() => handleDeallocateStudent(room._id, st._id)}
                                title="Deallocate Student"
                                className="text-slate-400 hover:text-rose-600 transition p-1"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No students allocated yet.</p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                {(isAdmin || isWarden) && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {!isFull && room.status !== 'maintenance' ? (
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setShowAllocateModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Allocate Student
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No beds vacant</span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        title="Delete Room"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD ROOM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Add New Hostel Room</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 401"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Wing / Block *</label>
                  <select
                    value={newRoom.block}
                    onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Green PG Wing A">Green PG Wing A</option>
                    <option value="City Nest Wing B">City Nest Wing B</option>
                    <option value="Sunrise PG Wing C">Sunrise PG Wing C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Floor</label>
                  <input
                    type="number"
                    min="1"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      let cap = 2;
                      if (type === 'Single') cap = 1;
                      if (type === 'Triple') cap = 3;
                      if (type === 'Four-Bed') cap = 4;
                      setNewRoom({ ...newRoom, type, capacity: cap });
                    }}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Four-Bed">Four-Bed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={newRoom.pricePerMonth}
                  onChange={(e) => setNewRoom({ ...newRoom, pricePerMonth: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={newRoom.amenities}
                  onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALLOCATE STUDENT */}
      {showAllocateModal && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">
                Allocate to Room {selectedRoom.roomNumber}
              </h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAllocateStudent} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student *</label>
                <select
                  required
                  value={allocationData.studentId}
                  onChange={(e) => setAllocationData({ ...allocationData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose a Student --</option>
                  {studentsList.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} ({st.studentId || st.email}) {st.room ? `[Currently: Room ${st.room.roomNumber}]` : '[Unallocated]'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Bed Number</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.capacity}
                  value={allocationData.bedNumber}
                  onChange={(e) => setAllocationData({ ...allocationData, bedNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Rooms;

