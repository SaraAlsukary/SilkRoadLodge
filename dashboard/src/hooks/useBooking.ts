import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiConfig';

// تعريف واجهات البيانات
interface BookedInterval {
    start: Date;
    end: Date;
}

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
    const queryClient = useQueryClient();

    // للحفاظ على التوافق مع جلب الغرف بالـ ID ديناميكياً ودعم الترقيم
    const [activeRoomId, setActiveRoomId] = useState<string | number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // رسائل النجاح والخطأ المخصصة التي كانت تُدار يدوياً
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [customError, setCustomError] = useState<string | null>(null);

    // ----------------------------------------------------
    // 1. الاستعلامات (Queries)
    // ----------------------------------------------------

    // جلب التواريخ المحجوزة
    const bookedDatesQuery = useQuery<BookedInterval[]>({
        queryKey: ['bookedDates', activeRoomId],
        queryFn: async () => {
            const response = await api.get(`/rooms/${activeRoomId}/booked-dates`);
            if (response.data.success) {
                return response.data.booked_dates.map((booking: any) => ({
                    start: new Date(booking.check_in),
                    end: new Date(booking.check_out)
                }));
            }
            throw new Error('فشل في جلب التواريخ');
        },
        enabled: !!activeRoomId,
    });

    // جلب كل الحجوزات للأدمن
    const adminBookingsQuery = useQuery<BookingData[]>({
        queryKey: ['adminBookings', currentPage],
        queryFn: async () => {
            const response = await api.get(`/admin/bookings?page=${currentPage}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'فشل في تحميل قائمة الحجوزات.');
        },
    });

    // ----------------------------------------------------
    // 2. العمليات (Mutations)
    // ----------------------------------------------------

    const createBookingMutation = useMutation({
        mutationFn: async (bookingData: any) => {
            const response = await api.post('/bookings', bookingData, { timeout: 300000 });
            return response.data;
        },
        onSuccess: () => {
            setSuccess(true);
            queryClient.invalidateQueries({ queryKey: ['bookedDates'] });
        },
        onError: (err: any) => {
            setSuccess(false);
            let errorMessage = err.response?.data?.message || 'حدث خطأ أثناء إرسال الحجز.';
            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(' | ');
                errorMessage = `${errorMessage} - ${validationErrors}`;
            }
            setCustomError(errorMessage);
        }
    });

    const updateBookingMutation = useMutation({
        mutationFn: async ({ id, updatedData }: { id: string | number; updatedData: any }) => {
            const response = await api.put(`/admin/bookings/${id}`, updatedData);
            return response.data.data;
        },
        onSuccess: () => {
            setSuccessMessage('تم تحديث بيانات الحجز بنجاح.');
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
        },
        onError: (err: any) => {
            setCustomError(err.response?.data?.message || 'حدث خطأ أثناء محاولة تحديث الحجز.');
        }
    });

    const cancelBookingMutation = useMutation({
        mutationFn: async (id: string | number) => {
            const response = await api.put(`/admin/bookings/${id}/cancel/`);
            return response.data;
        },
        onSuccess: (data) => {
            setSuccessMessage(data.message || 'تم إلغاء الحجز بنجاح.');
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookedDates'] });
        },
        onError: (err: any) => {
            setCustomError(err.response?.data?.message || 'حدث خطأ أثناء محاولة إلغاء الحجز.');
        }
    });

    const deleteBookingMutation = useMutation({
        mutationFn: async (id: string | number) => {
            const response = await api.delete(`/admin/bookings/${id}`);
            return response.data;
        },
        onSuccess: (data) => {
            setSuccessMessage(data.message || 'تم حذف الحجز بنجاح.');
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookedDates'] });
        },
        onError: (err: any) => {
            setCustomError(err.response?.data?.message || 'حدث خطأ أثناء محاولة حذف الحجز.');
        }
    });

    const deleteAllBookingMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/admin/bookings/cancelled/clear`);
            return response.data;
        },
        onSuccess: (data) => {
            setSuccessMessage(data.message || 'تم حذف الحجز بنجاح.');
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
        },
        onError: (err: any) => {
            setCustomError(err.response?.data?.message || 'حدث خطأ أثناء محاولة حذف الحجز.');
        }
    });

    // ----------------------------------------------------
    // 3. محاكاة الدوال القديمة بنفس التواقيع (Signatures)
    // ----------------------------------------------------

    const fetchBookedDates = async (roomId: string | number) => {
        setCustomError(null);
        setActiveRoomId(roomId);
        // إرجاع التواريخ مباشرة إذا كانت موجودة مسبقاً أو الانتظار لجلبها
        const result = await queryClient.fetchQuery({
            queryKey: ['bookedDates', roomId],
            queryFn: async () => {
                const response = await api.get(`/rooms/${roomId}/booked-dates`);
                return response.data.booked_dates.map((booking: any) => ({
                    start: new Date(booking.check_in),
                    end: new Date(booking.check_out)
                }));
            }
        });
        return result;
    };

    const fetchAllBookings = useCallback(async (page = 1) => {
        setCustomError(null);
        setCurrentPage(page);
        const result = await queryClient.fetchQuery({
            queryKey: ['adminBookings', page],
            queryFn: async () => {
                const response = await api.get(`/admin/bookings?page=${page}`);
                return response.data.data;
            }
        });
        return result;
    }, [queryClient]);

    const createBooking = async (bookingData: any) => {
        setCustomError(null);
        setSuccess(false);
        return createBookingMutation.mutateAsync(bookingData);
    };

    const updateBooking = async (id: string | number, updatedData: { status?: string; notes?: string }) => {
        setCustomError(null);
        setSuccessMessage(null);
        return updateBookingMutation.mutateAsync({ id, updatedData });
    };

    const cancelBooking = async (id: string | number) => {
        setCustomError(null);
        setSuccessMessage(null);
        await cancelBookingMutation.mutateAsync(id);
        return true;
    };

    const deleteBooking = async (id: string | number) => {
        setCustomError(null);
        setSuccessMessage(null);
        await deleteBookingMutation.mutateAsync(id);
        return true;
    };

    const deleteAllBooking = async (id: string | number) => {
        setCustomError(null);
        setSuccessMessage(null);
        await deleteAllBookingMutation.mutateAsync();
        return true;
    };

    // تجميع حالة التحميل الشاملة لجميع العمليات
    const isLoading =
        bookedDatesQuery.isFetching ||
        adminBookingsQuery.isFetching ||
        createBookingMutation.isPending ||
        updateBookingMutation.isPending ||
        cancelBookingMutation.isPending ||
        deleteBookingMutation.isPending ||
        deleteAllBookingMutation.isPending;

    // تجميع أخطاء الاستعلامات أو العمليات
    const error =
        customError ||
        (bookedDatesQuery.error as any)?.message ||
        (adminBookingsQuery.error as any)?.message ||
        null;

    // البيانات المستخرجة من الكاش مباشرة لتغذية المتغيرات القديمة
    const bookings = adminBookingsQuery.data || [];
    const bookedDates = bookedDatesQuery.data || [];

    // ----------------------------------------------------
    // الـ الـ Return بنفس التسميات القديمة تماماً 🚀
    // ----------------------------------------------------
    return {
        createBooking,
        fetchBookedDates,
        bookedDates,
        isLoading,
        error,
        success,
        setSuccess,

        // المخرجات القديمة الخاصة بالأدمن
        bookings,
        successMessage,
        cancelBooking,
        deleteAllBooking,
        fetchAllBookings,
        updateBooking,
        deleteBooking,
        setSuccessMessage,
        setError: setCustomError // ربط الـ setError القديم بالـ state الجديد للخطأ المخصص
    };
}