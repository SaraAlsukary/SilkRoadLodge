import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiConfig';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'admin';
}

export const useAuth = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('admin_token');

    // 🔍 1. جلب بيانات الأدمن والتأكد من صلاحية التوكن من السيرفر
    const { data: user, isLoading, isError } = useQuery<AdminUser>({
        queryKey: ['admin_profile'],
        queryFn: async () => {
            const { data } = await api.get('/admin/me'); // تأكد من إنشاء هذا المسار في لارافيل
            return data.user;
        },
        retry: false, // لا تعيد المحاولة في حال فشل التوكن
        enabled: !!token, // لا تنفذ الطلب إلا إذا كان التوكن موجوداً محلياً بالفعل
    });

    // 🟢 2. دالة تسجيل الدخول
    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const { data } = await api.post('/admin/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem('admin_token', data.access_token);
            // تحديث الكاش فوراً ببيانات الأدمن الجديدة
            queryClient.setQueryData(['admin_profile'], data.user);
            window.location.href = '/dashboard';
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });

    // 🔴 3. دالة تسجيل الخروج
    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post('/admin/logout');
        },
        onSuccess: () => {
            localStorage.removeItem('admin_token');
            queryClient.clear(); // تنظيف كاش الـ React Query بالكامل
            window.location.href = '/login';
        },
        onError: () => {
            // حماية احتياطية: الخروج محلياً حتى لو سقط السيرفر
            localStorage.removeItem('admin_token');
            queryClient.clear();
            window.location.href = '/login';
        }
    });

    return {
        user,
        isLoading: isLoading && !!token, // نعتبره يحمل فقط لو التوكن موجود وجاري فصحه
        isError,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error as any,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    };
};