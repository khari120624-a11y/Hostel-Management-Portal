import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Edit,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Mess = () => {
  const { user, isAdmin, isWarden } = useAuth();
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to today's day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState(todayName);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    breakfast: { items: '', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: '', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: '', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: '', timing: '07:30 PM - 09:30 PM' },
    specialNote: '',
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mess');
      if (res.data.success) {
        setWeeklyMenu(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching mess menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const currentDayMenu = weeklyMenu.find(
    (m) => m.day.toLowerCase() === selectedDay.toLowerCase()
  ) || {
    day: selectedDay,
    breakfast: { items: ['Idli & Sambar', 'Chutney', 'Filter Coffee'], timing: '07:30 AM - 09:30 AM' },
    lunch: { items: ['Steamed Rice', 'Dal Tadka', 'Seasonal Veg Curry', 'Curd', 'Roti'], timing: '12:30 PM - 02:30 PM' },
    snacks: { items: ['Samosa / Poha', 'Tea & Coffee'], timing: '05:00 PM - 06:00 PM' },
    dinner: { items: ['Paneer Butter Masala', 'Tawa Roti', 'Jeera Rice', 'Gulab Jamun'], timing: '07:30 PM - 09:30 PM' },
    specialNote: 'Chef special prepared with fresh organic ingredients.',
  };

  const handleOpenEdit = () => {
    setEditFormData({
      breakfast: {
        items: currentDayMenu.breakfast?.items?.join(', ') || '',
        timing: currentDayMenu.breakfast?.timing || '07:30 AM - 09:30 AM',
      },
      lunch: {
        items: currentDayMenu.lunch?.items?.join(', ') || '',
        timing: currentDayMenu.lunch?.timing || '12:30 PM - 02:30 PM',
      },
      snacks: {
        items: currentDayMenu.snacks?.items?.join(', ') || '',
        timing: currentDayMenu.snacks?.timing || '05:00 PM - 06:00 PM',
      },
      dinner: {
        items: currentDayMenu.dinner?.items?.join(', ') || '',
        timing: currentDayMenu.dinner?.timing || '07:30 PM - 09:30 PM',
      },
      specialNote: currentDayMenu.specialNote || '',
    });
    setShowEditModal(true);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        breakfast: {
          items: editFormData.breakfast.items.split(',').map((s) => s.trim()),
          timing: editFormData.breakfast.timing,
        },
        lunch: {
          items: editFormData.lunch.items.split(',').map((s) => s.trim()),
          timing: editFormData.lunch.timing,
        },
        snacks: {
          items: editFormData.snacks.items.split(',').map((s) => s.trim()),
          timing: editFormData.snacks.timing,
        },
        dinner: {
          items: editFormData.dinner.items.split(',').map((s) => s.trim()),
          timing: editFormData.dinner.timing,
        },
        specialNote: editFormData.specialNote,
      };

      const res = await api.put(`/mess/${selectedDay}`, payload);
      if (res.data.success) {
        setShowEditModal(false);
        fetchMenu();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating menu');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Mess & Dining Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Nutritious multi-course dining timetable with daily breakfast, lunch, snacks and dinner.
          </p>
        </div>

        {(isAdmin || isWarden) && (
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition shrink-0"
          >
            <Edit className="w-4 h-4" />
            <span>Edit {selectedDay}'s Menu</span>
          </button>
        )}
      </div>

      {/* 7 Days Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayName === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day's Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Breakfast */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Coffee className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Breakfast</h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Morning
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDayMenu.breakfast?.timing || '07:30 AM - 09:30 AM'}</span>
            </div>

            <ul className="space-y-2">
              {currentDayMenu.breakfast?.items?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Lunch */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Lunch</h3>
              </div>
              <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                Afternoon
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDayMenu.lunch?.timing || '12:30 PM - 02:30 PM'}</span>
            </div>

            <ul className="space-y-2">
              {currentDayMenu.lunch?.items?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Snacks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Sunset className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Evening Snacks</h3>
              </div>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                Evening
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDayMenu.snacks?.timing || '05:00 PM - 06:00 PM'}</span>
            </div>

            <ul className="space-y-2">
              {currentDayMenu.snacks?.items?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Dinner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Dinner</h3>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Night
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDayMenu.dinner?.timing || '07:30 PM - 09:30 PM'}</span>
            </div>

            <ul className="space-y-2">
              {currentDayMenu.dinner?.items?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Special Chef Note */}
      {currentDayMenu.specialNote && (
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs sm:text-sm text-amber-900 font-medium">
            <span className="font-bold">Notice from Mess Committee:</span> {currentDayMenu.specialNote}
          </p>
        </div>
      )}

      {/* MODAL: EDIT MENU */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Update {selectedDay} Menu</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Breakfast Items (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={editFormData.breakfast.items}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    breakfast: { ...editFormData.breakfast, items: e.target.value },
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Lunch Items (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={editFormData.lunch.items}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    lunch: { ...editFormData.lunch, items: e.target.value },
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Snacks Items (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={editFormData.snacks.items}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    snacks: { ...editFormData.snacks, items: e.target.value },
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dinner Items (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={editFormData.dinner.items}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    dinner: { ...editFormData.dinner, items: e.target.value },
                  })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dietary Special Note</label>
                <textarea
                  rows="2"
                  value={editFormData.specialNote}
                  onChange={(e) => setEditFormData({ ...editFormData, specialNote: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Mess;

