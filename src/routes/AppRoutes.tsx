import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Auth page
import { LoginPage } from '../pages/auth/LoginPage';

// Student pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { CreateReportPage } from '../pages/student/CreateReportPage';
import { ReportHistoryPage } from '../pages/student/ReportHistoryPage';
import { StudentReportDetail } from '../pages/student/StudentReportDetail';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';

// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminReportDetail } from '../pages/admin/AdminReportDetail';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { LocationManagementPage } from '../pages/admin/LocationManagementPage';
import { AdminProfilePage } from '../pages/admin/AdminProfilePage';

/**
 * Guard for routes requiring a specific role
 */
const ProtectedRoleRoute: React.FC<{
  allowedRole: 'mahasiswa' | 'admin';
  children: React.ReactElement;
}> = ({ allowedRole, children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              !isAuthenticated
                ? '/login'
                : role === 'admin'
                ? '/admin/dashboard'
                : '/student/dashboard'
            }
            replace
          />
        }
      />

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoleRoute allowedRole="mahasiswa">
            <DashboardLayout />
          </ProtectedRoleRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="reports" element={<ReportHistoryPage />} />
        <Route path="reports/create" element={<CreateReportPage />} />
        <Route path="reports/:id" element={<StudentReportDetail />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <DashboardLayout />
          </ProtectedRoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="reports/:id" element={<AdminReportDetail />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="locations" element={<LocationManagementPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              !isAuthenticated
                ? '/login'
                : role === 'admin'
                ? '/admin/dashboard'
                : '/student/dashboard'
            }
            replace
          />
        }
      />
    </Routes>
  );
};
