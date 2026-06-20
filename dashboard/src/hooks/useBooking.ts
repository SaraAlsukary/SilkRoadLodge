import { useState } from 'react';
import api from '../api/apiConfig';

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
                    // "Accept-Language": 'en'
                },
                timeout: 300000
            });
            if (response.data.success) {
                setSuccess(true);
                return response.data;
            }
        } catch (err: any) {
            console.error("تفاصيل الخطأ الكاملة:", err);
            console.error("استجابة السيرفر إن وجدت:", err.response);

            if (err.code === 'ECONNABORTED') {
                setError('استغرق الخادم وقتاً طويلاً للرد. تم استلام طلبك وجاري معالجته.');
            } else {
                // 🌟 استخراج رسالة الخطأ الأساسية
                let errorMessage = err.response?.data?.message || 'حدث خطأ أثناء إرسال الحجز.';

                // 🌟 استخراج تفاصيل أخطاء الـ Validation من لارافيل (إن وجدت)
                if (err.response?.data?.errors) {
                    const validationErrors = Object.values(err.response.data.errors).flat().join(' | ');
                    errorMessage = `${errorMessage} - ${validationErrors}`;
                }

                setError(errorMessage);
            }
            throw err;
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