import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute() {
    const { user, isLoading } = useAuth();
    const token = localStorage.getItem('admin_token');

    if (isLoading) return null;

    // لو الأدمن مسجل دخوله بالفعل وحاول يفتح صفحة الـ login، يتم نقله تلقائياً للـ dashboard
    if (token && user && user.role === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}