import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Droplets,
  Zap,
  Shirt,
  ShieldCheck,
  Dumbbell,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Plus,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const categoryIcons = {
  WiFi: Wifi,
  'Water Supply': Droplets,
  'Electricity & Backup': Zap,
  Laundry: Shirt,
  'Security & CCTV': ShieldCheck,
  'Gym & Recreation': Dumbbell,
};

const Amenities = () => {
  const { user, isAdmin, isWarden } = useAuth();
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status edit modal
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusVal, setStatusVal] = useState('Operational');

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/amenities');
      if (res.data.success) {
        setAmenities(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedAmenity) return;
    try {
      const res = await api.put(`/amenities/${selectedAmenity._id}`, { status: statusVal });
      if (res.data.success) {
        setShowModal(false);
        fetchAmenities();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating amenity');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Hostel Amenities & Utilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor 24/7 essential services including fiber Wi-Fi, RO water dispensers, backup generators and laundry.
          </p>
        </div>

        <button
          onClick={() => navigate('/complaints')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Utility Issue</span>
        </button>
      </div>

      {/* Grid of Amenities */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading amenities status...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {amenities.map((item) => {
            const IconComponent = categoryIcons[item.category] || ShieldCheck;
            const isOperational = item.status === 'Operational';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isOperational
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isOperational ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{item.description}</p>

                  <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.inChargeName} ({item.contactPhone})</span>
                    </div>
                  </div>
                </div>

                {(isAdmin || isWarden) && (
                  <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedAmenity(item);
                        setStatusVal(item.status);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-3.5 h-3.5" /> Change Status
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: UPDATE AMENITY STATUS */}
      {showModal && selectedAmenity && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-3">
              Update {selectedAmenity.name} Status
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Limited Service">Limited Service</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Amenities;

