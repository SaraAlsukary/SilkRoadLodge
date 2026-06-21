import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth();
    const token = localStorage.getItem('admin_token');

    // أثناء فحص التوكن مع السيرفر، نعرض شاشة تحميل تليق بالفندق
    if (isLoading) {
        return (
            // <div className="min-h-screen bg-silk-cream flex items-center justify-center font-arabic">
            //     <div className="text-silk-brown text-2xl font-bold animate-pulse">
            //       ... جاري التحقق من الهوية
            //     </div>
            // </div>
            <Loading />
        );
    }

    // إذا لم يكن هناك توكن، أو السيرفر رفض التوكن، أو الدور ليس admin -> طرد فوري
    if (!token || !user || user.role !== 'admin') {
        localStorage.removeItem('admin_token');
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}