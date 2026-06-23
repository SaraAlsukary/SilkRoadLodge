import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons, STATUS_MAP } from '../constants/admin';

interface BookingsListProps {
    apiBookings: any[];
    theme: any;
    // قمنا بتغيير Promise<void> إلى Promise<any> لتجنب تعارض الأنواع
    updateBooking: (id: string | number, data: any) => Promise<any>;
    deleteBooking: (id: string | number) => Promise<any>;
}

export default function BookingsList({ apiBookings, theme, updateBooking, deleteBooking }: BookingsListProps) {
    const [statusFilter, setStatusFilter] = useState('الكل');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | number | null }>({ isOpen: false, id: null });
    const [statusDialog, setStatusDialog] = useState<{ isOpen: boolean; id: string | number | null; currentStatus: string; newStatus: string }>({ isOpen: false, id: null, currentStatus: '', newStatus: '' });

    const confirmDeleteBooking = async () => {
        if (deleteDialog.id) {
            await deleteBooking(deleteDialog.id);
            setDeleteDialog({ isOpen: false, id: null });
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

    const filteredBookings = apiBookings?.filter(b => {
        const translatedStatus = STATUS_MAP[b.status?.toLowerCase()] || b.status;
        return statusFilter === 'الكل' ? true : translatedStatus === statusFilter;
    }) || [];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-silk-sand animate-pulse" />
                    قائمة النزلاء الحالية
                </h3>
                <div className="flex gap-2 p-1.5 bg-black/10 dark:bg-white/5 rounded-2xl w-fit border border-inherit">
                    {['الكل', 'مؤكد', 'ملغى'].map(f => (
                        <button key={f} onClick={() => setStatusFilter(f)}
                            className={`px-5 py-2 rounded-xl cursor-pointer text-md font-bold transition-all ${statusFilter === f ? 'bg-silk-sand text-silk-dark shadow-md' : 'hover:bg-white/5 opacity-70'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`rounded-3xl overflow-x-auto border pb-2 ${theme.card} custom-table-scrollbar`}>
                <table className="w-full text-right min-w-[1050px]">
                    <thead className="bg-black/20 text-md uppercase tracking-widest opacity-50">
                        <tr>
                            <th className="p-6 font-semibold">اسم النزيل</th>
                            <th className="p-6 font-semibold">معلومات الاتصال</th>
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
                                <td className="p-6">
                                    <p className="font-bold text-xl">{b.customer_name}</p>
                                    <p className="text-[11px] opacity-50 mt-1">GUEST ID: #{b.id}</p>
                                </td>
                                <td className="p-6">
                                    <p className="font-bold text-lg text-right" dir="ltr">{b.customer_phone}</p>
                                    <p className="text-sm opacity-70 mt-1">{b.customer_email || 'غير متوفر'}</p>
                                </td>
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
                                    <button onClick={() => setDeleteDialog({ isOpen: true, id: b.id })} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl text-md font-bold transition-colors cursor-pointer">
                                        إلغاء الحجز
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center opacity-50 flex flex-col items-center">
                        <Icons.List />
                        <p className="mt-4 text-xl font-bold">لا يوجد حجوزات مطابقة للبحث</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {deleteDialog.isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`w-full max-w-md p-6 rounded-3xl shadow-2xl ${theme.modalBg}`}>
                            <div className="flex items-center gap-4 text-red-500 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-full"><Icons.Alert /></div>
                                <h3 className="text-2xl font-bold">تأكيد الحذف</h3>
                            </div>
                            <p className="text-lg opacity-80 mb-8">هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
                            <div className="flex gap-4">
                                <button onClick={confirmDeleteBooking} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors cursor-pointer">حذف نهائي</button>
                                <button onClick={() => setDeleteDialog({ isOpen: false, id: null })} className="flex-1 py-3 bg-gray-500/10 hover:bg-gray-500/20 font-bold rounded-xl transition-colors cursor-pointer">تراجع</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {statusDialog.isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`w-full max-w-md p-6 rounded-3xl shadow-2xl ${theme.modalBg}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-silk-sand/10 text-silk-sand rounded-full"><Icons.Edit /></div>
                                <h3 className="text-2xl font-bold">تغيير حالة الحجز</h3>
                            </div>
                            <div className="space-y-4 mb-8">
                                <label className="block text-lg font-bold opacity-80">اختر الحالة الجديدة:</label>
                                <select value={statusDialog.newStatus} onChange={(e) => setStatusDialog(prev => ({ ...prev, newStatus: e.target.value }))} className={`w-full px-4 py-3 rounded-xl border outline-none font-bold text-lg ${theme.input} cursor-pointer`}>
                                    <option value="confirmed">مؤكد</option>
                                    <option value="cancelled">ملغى</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={confirmStatusUpdate} className="flex-1 py-3 bg-silk-sand text-silk-dark font-black rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">حفظ التغييرات</button>
                                <button onClick={() => setStatusDialog({ isOpen: false, id: null, currentStatus: '', newStatus: '' })} className="flex-1 py-3 bg-gray-500/10 hover:bg-gray-500/20 font-bold rounded-xl transition-colors cursor-pointer">إلغاء</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}