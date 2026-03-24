import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';

import SuperAdminDashboard from '../resources/js/Pages/SuperAdmin/Dashboard';
import AdminDashboard from '../resources/js/Pages/Admin/Dashboard';
import CommercialDashboard from '../resources/js/Pages/Commercial/Dashboard';
import ClientDashboard from '../resources/js/Pages/Client/Dashboard';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route
                        path="/super-admin/*"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <SuperAdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/commercial/*"
                        element={
                            <ProtectedRoute allowedRoles={['commercial']}>
                                <CommercialDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/client/*"
                        element={
                            <ProtectedRoute allowedRoles={['client']}>
                                <ClientDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
