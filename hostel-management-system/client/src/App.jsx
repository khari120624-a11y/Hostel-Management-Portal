import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Students from './pages/Students';
import Mess from './pages/Mess';
import Amenities from './pages/Amenities';
import Payments from './pages/Payments';
import Team from './pages/Team';
import Visitors from './pages/Visitors';
import Complaints from './pages/Complaints';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="students" element={<Students />} />
            <Route path="mess" element={<Mess />} />
            <Route path="amenities" element={<Amenities />} />
            <Route path="payments" element={<Payments />} />
            <Route
              path="team"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <Team />
                </ProtectedRoute>
              }
            />
            <Route
              path="visitors"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <Visitors />
                </ProtectedRoute>
              }
            />
            <Route path="complaints" element={<Complaints />} />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

