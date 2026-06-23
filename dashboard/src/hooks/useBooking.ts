import { useState, useCallback } from 'react';
import api from '../api/apiConfig';

// تعريف واجهة برمجية لشكل الفترات المحجوزة المتوقعة للتقويم
interface BookedInterval {
    start: Date;
    end: Date;
}

// 👈 إضافة واجهة برمجية لبيانات الحجز الشاملة للأدمن
interface BookingData {
    id: number | string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    status: 'confirmed' | 'cancelled' | 'completed';
    check_in: string;
    check_out: string;
    rooms_count: number;
    double_beds_count: number;
    single_beds_count: number;
    booked_room_names: string;
    notes?: string;
    [key: string]: any;
}

export function useBooking() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 🌟 حالات جديدة مضافة للإدارة والرسائل
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [bookedDates, setBookedDates] = useState<BookedInterval[]>([]);

    /**
     * فحص الفترات المحجوزة للتقويم
     */
    const fetchBookedDates = async (roomId: string | number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/rooms/${roomId}/booked-dates`);
            if (response.data.success) {
                const intervals = response.data.booked_dates.map((booking: any) => ({
                    start: new Date(booking.check_in),
                    end: new Date(booking.check_out)
                }));
                setBookedDates(intervals);
                return intervals;
            }
        } catch (err: any) {
            console.error("Error fetching booked dates:", err);
            setError('لم نتمكن من تحميل مواعيد توفر الغرفة المشغولة حالياً.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * إرسال وإنشاء حجز جديد
     */
    const createBooking = async (bookingData: any) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.post('/bookings', bookingData, {
                timeout: 300000
            });
            if (response.data.success) {
                setSuccess(true);
                return response.data;
            }
        } catch (err: any) {
            console.error("تفاصيل الخطأ الكاملة:", err);
            if (err.code === 'ECONNABORTED') {
                setError('استغرق الخادم وقتاً طويلاً للرد. تم استلام طلبك وجاري معالجته.');
            } else {
                let errorMessage = err.response?.data?.message || 'حدث خطأ أثناء إرسال الحجز.';
                if (err.response?.data?.errors) {
                    const validationErrors = Object.values(err.response.data.errors).flat().join(' | ');
                    errorMessage = `${errorMessage} - ${validationErrors}`;
                }
                setError(errorMessage);
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 🌟 [أدمن] جلب كل الحجوزات للإدارة
     * Route: GET /api/admin/bookings
     */
    const fetchAllBookings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/bookings');
            if (response.data.success) {
                setBookings(response.data.data);
                return response.data.data;
            }
        } catch (err: any) {
            console.error("Error fetching admin bookings:", err);
            setError(err.response?.data?.message || 'فشل في تحميل قائمة الحجوزات الخاصة بالإدارة.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * 🌟 [أدمن] تحديث حجز (حالة الحجز أو الملاحظات)
     * Route: PUT /api/admin/bookings/{id}
     */
    const updateBooking = async (id: string | number, updatedData: { status?: string; notes?: string }) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await api.put(`/admin/bookings/${id}`, updatedData);
            if (response.data.success) {
                setSuccessMessage('تم تحديث بيانات الحجز بنجاح.');

                // تحديث البيانات في الحالة محلياً لتحديث الواجهة فوراً
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.id === id ? { ...booking, ...response.data.data } : booking
                    )
                );
                return response.data.data;
            }
        } catch (err: any) {
            console.error(`Error updating booking ${id}:`, err);
            setError(err.response?.data?.message || 'حدث خطأ أثناء محاولة تحديث الحجز.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 🌟 [أدمن] إلغاء أو حذف حجز نهائياً
     * Route: DELETE /api/admin/bookings/{id}
     */
    const deleteBooking = async (id: string | number) => {
       
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await api.delete(`/admin/bookings/${id}`);
            if (response.data.success) {
                setSuccessMessage(response.data.message || 'تم حذف الحجز بنجاح.');

                // إزالة الحجز المحذوف من الحالة محلياً فوراً
                setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
                return true;
            }
        } catch (err: any) {
            console.error(`Error deleting booking ${id}:`, err);
            setError(err.response?.data?.message || 'حدث خطأ أثناء محاولة حذف الحجز.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // إرجاع كافة الدوال والحالات القديمة والجديدة
    return {
        createBooking,
        fetchBookedDates,
        bookedDates,
        isLoading,
        error,
        success,
        setSuccess,

        // 🌟 المخرجات الجديدة الخاصة بالأدمن
        bookings,
        successMessage,
        fetchAllBookings,
        updateBooking,
        deleteBooking,
        setSuccessMessage,
        setError
    };
}