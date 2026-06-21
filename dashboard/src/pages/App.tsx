import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import GuestRoute from '../components/GuestRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // لمنع إعادة الاستدعاء التلقائي بمجرد الانتقال بين نوافذ المتصفح
      retry: 1, // عدد محاولات إعادة الطلب عند الفشل
    },
  },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>

                    {/* 🔓 مسارات الضيوف (ممنوع دخول الأدمن المسجل لها) */}
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                    </Route>

                    {/* 🔒 مسارات المحمية (ممنوع دخول أي شخص إلا الأدمن الفعلي الموثق) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* يمكنك إضافة مسارات إدارة الحجوزات الأخرى هنا */}
                    </Route>

                    {/* تحويل تلقائي لأي مسار عشوائي */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />

                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}