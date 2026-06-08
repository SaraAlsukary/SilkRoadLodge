import { useState } from 'react';
import api from '../api/apiConfig';
import i18n from '../i18n';

// تعريف واجهة برمجية لشكل الفترات المحجوزة المتوقعة للتقويم
interface BookedInterval {
    start: Date;
    end: Date;
}

export function useBooking() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 👈 الحالة الجديدة لتخزين الفترات الزمنية المحجوزة للغرفة المطلوبة
    const [bookedDates, setBookedDates] = useState<BookedInterval[]>([]);

    const fetchBookedDates = async (roomId: string | number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/rooms/${roomId}/booked-dates`);
            if (response.data.success) {
                // تحويل نصوص التواريخ القادمة من لارافيل إلى كائنات Date حقيقية لـ React DatePicker
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
                headers: {
                    "Accept-Language": i18n.language
                }
            });
            if (response.data.success) {
                setSuccess(true);
                return response.data;
            }
        } catch (err: any) {
            const serverMessage = err.response?.data?.message || 'حدث خطأ أثناء إرسال الحجز.';
            setError(serverMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // قمنا بإضافة fetchBookedDates و bookedDates للمخرجات ليتم استدعاؤها في الـ Component
    return {
        createBooking,
        fetchBookedDates,
        bookedDates,
        isLoading,
        error,
        success,
        setSuccess
    };
}