import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons, STATUS_MAP } from '../constants/admin';

interface BookingsListProps {
    apiData: any;
    isLoading:boolean;
    theme: any;
    updateBooking: (id: string | number, data: any) => Promise<any>;
    deleteBooking: (id: string | number) => Promise<any>;
    cancelBooking: (id: string | number) => Promise<any>;
    onPageChange: (page: number) => void;
}
const SERVICES_TRANSLATIONS: Record<string, string> = {
    "bedouin_tent_title": "الخيمة البدوية",
    "safari_tour_title": "رحلات الخيول والجمال",
    "bicycles_title": "تأجير الدراجات هوائية",
    "airport_pickup_title": "خدمة النقل من وإلى المطار",
    "syria_tour_title": "جولة سياحية في سوريا",
    "breakfast": "وجبة إفطار",
    "lunch": "وجبة غداء",
    "dinner": "وجبة عشاء",
    // يمكنك إضافة أي خدمات أخرى هنا مستقبلاً
};
export default function BookingsList({ apiData, theme, updateBooking, cancelBooking, deleteBooking, onPageChange, isLoading }: BookingsListProps) {
    const [statusFilter, setStatusFilter] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');

    // استخراج بيانات الـ Pagination والبيانات الفعلية من الـ API
    const bookings = apiData?.data || [];
    const currentPage = apiData?.current_page || 1;
    const totalPages = apiData?.last_page || 1;

    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | number | null; type: 'cancel' | 'delete' }>({ isOpen: false, id: null, type: 'cancel' });
    const [statusDialog, setStatusDialog] = useState<{ isOpen: boolean; id: string | number | null; currentStatus: string; newStatus: string }>({ isOpen: false, id: null, currentStatus: '', newStatus: '' });
    const [detailsDialog, setDetailsDialog] = useState<{ isOpen: boolean; booking: any | null }>({ isOpen: false, booking: null });

    const confirmDeleteBooking = async () => {
        if (deleteDialog.id) {
            if (deleteDialog.type === 'delete') {
                await deleteBooking(deleteDialog.id);
            } else {
                await cancelBooking(deleteDialog.id);
            }
            setDeleteDialog({ isOpen: false, id: null, type: 'cancel' });
        }
    };

    const confirmStatusUpdate = async () => {
        if (statusDialog.id && statusDialog.newStatus) {
            await updateBooking(statusDialog.id, { status: statusDialog.newStatus });
            setStatusDialog({ isOpen: false, id: null, currentStatus: '', newStatus: '' });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    // الفلترة والبحث الشامل بكل الحقول والخدمات والملاحظات والتواريخ
    const filteredBookings = useMemo(() => {
        if (!Array.isArray(bookings)) return [];

        return bookings.filter(b => {
            const translatedStatus = STATUS_MAP[b.status?.toLowerCase()] || b.status;
            const matchesStatus = statusFilter === 'الكل' ? true : translatedStatus === statusFilter;

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                (b.customer_name?.toLowerCase().includes(searchLower)) ||
                (b.customer_phone?.includes(searchLower)) ||
                (b.customer_email?.toLowerCase().includes(searchLower)) ||
                (b.nationality?.toLowerCase().includes(searchLower)) ||
                (b.booked_room_names?.toLowerCase().includes(searchLower)) ||
                (b.check_in?.includes(searchLower)) ||
                (b.check_out?.includes(searchLower)) ||
                (b.notes?.toLowerCase().includes(searchLower)) ||
                (b.requested_services?.join(" ")?.toLowerCase().includes(searchLower));

            return matchesStatus && matchesSearch;
        });
    }, [bookings, statusFilter, searchQuery]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">

            {/* الترويسة والفلترة والبحث */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-silk-sand animate-pulse" />
                    قائمة النزلاء الحالية
                </h3>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="ابحث بالاسم، التاريخ، الخدمة، الملاحظات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full px-4 py-2 rounded-2xl border outline-none ${theme.input} placeholder:opacity-50 text-sm`}
                        />
                    </div>

                    <div className="flex w-full md:w-auto gap-2 p-1.5 bg-black/10 dark:bg-white/5 rounded-2xl border border-inherit overflow-x-auto">
                        {['الكل', 'مؤكد', 'ملغى'].map(f => (
                            <button key={f} onClick={() => setStatusFilter(f)}
                                className={`flex-1 md:flex-none px-5 py-2 rounded-xl cursor-pointer text-md font-bold transition-all whitespace-nowrap ${statusFilter === f ? 'bg-silk-sand text-silk-dark shadow-md' : 'hover:bg-white/5 opacity-70'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* الجدول */}
            <div className={`rounded-3xl overflow-x-auto border pb-2 ${theme.card} custom-table-scrollbar`}>
                <table className="w-full text-right min-w-[1050px]">
                    <thead className="bg-black/20 text-md uppercase tracking-widest opacity-50">
                        <tr>
                            <th className="p-6 font-semibold">اسم النزيل</th>
                            {/* <th className="p-6 font-semibold">معلومات الاتصال</th> */}
                            <th className="p-2 font-semibold text-center">عدد الغرف</th>
                            <th className="p-2 font-semibold text-center">الأسرّة المفردة</th>
                            <th className="p-2 font-semibold text-center">الأسرّة المزدوجة</th>
                            <th className="p-1 text-center font-semibold">التاريخ</th>
                            <th className="p-2 text-center font-semibold">الحالة</th>
                            <th className="p-6 text-center font-semibold">التحكم</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {filteredBookings.map(b => (
                            <motion.tr key={b.id} layout className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="p-2">
                                    <p className="font-bold text-xl">{b.customer_name}</p>
                                    <p className="text-[11px] opacity-50 mt-1">GUEST ID: #{b.id}</p>
                                </td>
                                {/* <td className="p-2">
                                    <p className="font-bold text-lg text-right" dir="ltr">{b.customer_phone}</p>
                                    <p className="text-sm opacity-70 mt-1">{b.customer_email || 'غير متوفر'}</p>
                                </td> */}
                                <td className="p-2 font-medium text-silk-sand text-xl text-center">{b.rooms_count}</td>
                                <td className="p-2 font-medium text-silk-sand text-xl text-center">{b.single_beds_count}</td>
                                <td className="p-2 font-medium text-silk-sand text-xl text-center">{b.double_beds_count}</td>
                                <td className="p-2 px-0 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-sm font-bold opacity-80 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{formatDate(b.check_in)}</span>
                                        <span className="opacity-30 text-md">→</span>
                                        <span className="text-sm font-bold opacity-80 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{formatDate(b.check_out)}</span>
                                    </div>
                                </td>
                                <td className="p-2 text-center">
                                    <span onClick={() => setStatusDialog({ isOpen: true, id: b.id, currentStatus: b.status, newStatus: b.status })}
                                        className={`px-4 py-1.5 rounded-full cursor-pointer hover:shadow-lg text-[14px] font-black inline-flex items-center gap-2 transition-all ${b.status === 'confirmed' ? 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'}`}
                                        title="تغيير الحالة">
                                        {STATUS_MAP[b.status?.toLowerCase()] || b.status} <Icons.Edit />
                                    </span>
                                </td>
                                <td className="p-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => setDetailsDialog({ isOpen: true, booking: b })} className="text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-xl text-md font-bold transition-colors cursor-pointer">
                                            التفاصيل
                                        </button>
                                        {b.status === 'cancelled' ? (
                                            <button onClick={() => setDeleteDialog({ isOpen: true, id: b.id, type: 'delete' })} className="text-red-600 hover:bg-red-600/10 px-4 py-2 rounded-xl text-md font-bold transition-colors cursor-pointer">
                                                حذف نهائي
                                            </button>
                                        ) : (
                                            <button onClick={() => setDeleteDialog({ isOpen: true, id: b.id, type: 'cancel' })} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl text-md font-bold transition-colors cursor-pointer">
                                                إلغاء
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center opacity-50 flex flex-col items-center">
                        <Icons.List />
                        <p className="mt-4 text-xl font-bold">لا توجد حجوزات مطابقة.</p>
                    </div>
                )}
            </div>

            {/* أزرار التنقل المرتبطة بالـ API مباشرة */}
            {totalPages > 0 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/5 font-bold disabled:opacity-30 transition-all hover:bg-black/20 dark:hover:bg-white/10 cursor-pointer"
                    >
                        السابق
                    </button>

                    <span className="font-bold opacity-70">
                        صفحة {currentPage} من {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/5 font-bold disabled:opacity-30 transition-all hover:bg-black/20 dark:hover:bg-white/10 cursor-pointer"
                    >
                        التالي
                    </button>
                </div>
            )}

            {/* نافذة تفاصيل الحجز الشاملة (Details Dialog) */}
            <AnimatePresence>
                {detailsDialog.isOpen && detailsDialog.booking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 ${theme.card} border border-black/10 dark:border-white/10 custom-scrollbar shadow-2xl`}
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-black/10 dark:border-white/10 pb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Icons.List /> تفاصيل الحجز الشاملة <span className="opacity-50">#{detailsDialog.booking.id}</span>
                                </h2>
                                <button onClick={() => setDetailsDialog({ isOpen: false, booking: null })} className="text-3xl opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                                    &times;
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                                {/* معلومات العميل */}
                                <div className="space-y-4 bg-black/5 dark:bg-white/5 p-5 rounded-2xl">
                                    <h3 className="font-bold text-xl mb-4 text-silk-sand">معلومات العميل</h3>
                                    <p className="flex justify-between"><span className="opacity-70">الاسم:</span> <span className="font-bold">{detailsDialog.booking.customer_name}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">رقم الهاتف:</span> <span className="font-bold" dir="ltr">{detailsDialog.booking.customer_phone}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">البريد الإلكتروني:</span> <span className="font-bold">{detailsDialog.booking.customer_email}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">البلد:</span> <span className="font-bold">{detailsDialog.booking.nationality}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">الجنس:</span> <span className="font-bold">{detailsDialog.booking.gender === 'male' ? 'ذكر' : detailsDialog.booking.gender === 'female' ? 'أنثى' : 'آخر'}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">العمر:</span> <span className="font-bold">{detailsDialog.booking.age} سنة</span></p>
                                </div>

                                {/* تفاصيل الإقامة */}
                                <div className="space-y-4 bg-black/5 dark:bg-white/5 p-5 rounded-2xl">
                                    <h3 className="font-bold text-xl mb-4 text-silk-sand">تفاصيل الإقامة</h3>
                                    <p className="flex justify-between"><span className="opacity-70">تاريخ الوصول:</span> <span className="font-bold">{formatDate(detailsDialog.booking.check_in)}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">تاريخ المغادرة:</span> <span className="font-bold">{formatDate(detailsDialog.booking.check_out)}</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">عدد الضيوف:</span> <span className="font-bold">{detailsDialog.booking.guests_count} ضيوف</span></p>
                                    <p className="flex justify-between"><span className="opacity-70">عدد الغرف الإجمالي:</span> <span className="font-bold">{detailsDialog.booking.rooms_count} غرف</span></p>
                                    <div className="pt-2 border-t border-black/10 dark:border-white/10 mt-2">
                                        <span className="opacity-70 block mb-2">توزيع الغرف والأسرة:</span>
                                        <p className="font-bold text-sm leading-relaxed text-silk-sand">{detailsDialog.booking.booked_room_names}</p>
                                    </div>
                                </div>

                                {/* الخدمات المضافة */}
                                <div className="space-y-4 bg-black/5 dark:bg-white/5 p-5 rounded-2xl md:col-span-2">
                                    <h3 className="font-bold text-xl mb-3 text-silk-sand">الخدمات المضافة</h3>
                                    {detailsDialog.booking.requested_services && detailsDialog.booking.requested_services.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {detailsDialog.booking.requested_services.map((service: string, index: number) => {
                                                // جلب الترجمة العربية، أو عرض الاسم الأصلي إذا لم تكن الترجمة موجودة
                                                const arabicName = SERVICES_TRANSLATIONS[service] || service.replace(/_/g, ' ');

                                                return (
                                                    <span key={index} className="px-4 py-2 bg-black/10 dark:bg-white/10 rounded-xl font-bold text-sm">
                                                        {arabicName}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="opacity-50 italic">لا توجد خدمات إضافية مطلوبة.</p>
                                    )}
                                </div>

                                {/* الملاحظات */}
                                <div className="space-y-4 bg-black/5 dark:bg-white/5 p-5 rounded-2xl md:col-span-2">
                                    <h3 className="font-bold text-xl mb-3 text-silk-sand">ملاحظات العميل</h3>
                                    {detailsDialog.booking.notes ? (
                                        <p className="whitespace-pre-wrap font-medium leading-relaxed p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5">
                                            {detailsDialog.booking.notes}
                                        </p>
                                    ) : (
                                        <p className="opacity-50 italic">لا توجد ملاحظات مرفقة مع هذا الحجز.</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setDetailsDialog({ isOpen: false, booking: null })} className="px-8 py-3 rounded-xl bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-all font-bold text-lg cursor-pointer">
                                    إغلاق
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* نافذة تأكيد الإلغاء أو الحذف (Delete/Cancel Dialog) */}
            <AnimatePresence>
                {deleteDialog.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md rounded-3xl p-6 ${theme.card} border border-inherit shadow-xl text-center`}>
                            <h3 className="text-2xl font-bold mb-4">{deleteDialog.type === 'delete' ? 'تأكيد الحذف النهائي' : 'تأكيد إلغاء الحجز'}</h3>
                            <p className="opacity-70 text-lg mb-6">{deleteDialog.type === 'delete' ? 'هل أنت متأكد من حذف هذا الحجز نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.' : 'هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟'}</p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={confirmDeleteBooking} className={`px-6 py-2.5  hover:bg-red-600 bg-red-500 ${isLoading ? "bg-red-400" : ""} text-white font-bold rounded-xl transition-colors cursor-pointer`} disabled={isLoading}>{isLoading?"جاري التأكيد..":"تأكيد"}</button>
                                <button onClick={() => setDeleteDialog({ isOpen: false, id: null, type: 'cancel' })} className="px-6 py-2.5 bg-black/10 dark:bg-white/10 rounded-xl font-bold transition-colors cursor-pointer" disabled={isLoading}>تراجع</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* نافذة تعديل الحالة (Status Update Dialog) */}
            <AnimatePresence>
                {statusDialog.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md rounded-3xl p-6 ${theme.card} border border-inherit shadow-xl text-right`}>
                            <h3 className="text-2xl font-bold mb-4">تحديث حالة الحجز</h3>
                            <div className="space-y-4 mb-6">
                                <label className="block font-bold opacity-70">اختر الحالة الجديدة:</label>
                                <select
                                    value={statusDialog.newStatus}
                                    onChange={(e) => setStatusDialog({ ...statusDialog, newStatus: e.target.value })}
                                    className={`w-full p-3 rounded-xl border outline-none ${theme.input} font-bold`}
                                >
                                    <option value="confirmed">مؤكد (Confirmed)</option>
                                    <option value="cancelled">ملغى (Cancelled)</option>
                                </select>
                            </div>
                            <div className="flex gap-4 justify-end">
                                <button onClick={confirmStatusUpdate} className="px-6 py-2.5 bg-silk-sand text-silk-dark font-bold rounded-xl transition-colors cursor-pointer">تحديث</button>
                                <button onClick={() => setStatusDialog({ isOpen: false, id: null, currentStatus: '', newStatus: '' })} className="px-6 py-2.5 bg-black/10 dark:bg-white/10 rounded-xl font-bold transition-colors cursor-pointer">إلغاء</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}