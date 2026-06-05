// import { useTranslation } from 'react-i18next';
// import { motion } from 'framer-motion';
// import { useRooms } from '../hooks/useRooms';

// const icons = {
//     single: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
//         </svg>
//     ),
//     double: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21 Gramc-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
//         </svg>
//     ),
//     bed: (
//         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.38-1.12-2.5-2.5-2.5H5.5A2.5 2.5 0 0 0 3 8.25v10.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75v-1.5h14v1.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V8.25ZM3.75 12h16.5M6.75 8.25h3v2.25h-3V8.25Zm7.5 0h3v2.25h-3V8.25Z" />
//         </svg>
//     ),
//     // 💡 تم تصحيح الكود هنا (تغيير الـ SVG بكود نظيف ومجرب لأيقونة بطاقة ائتمان/كاش)
//     price: (
//         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
//         </svg>
//     )
// };

// export default function RoomTypes() {
//     const { data: rooms, isLoading, isError, error } = useRooms();
//     const { t, i18n } = useTranslation();
//     const currentLanguage = i18n.language
//     // مصفوفة الغرف
//     const roomsData = [
//         { id: 'single_room', guests: 1, beds: 1, icon: icons.single, image: '/imgs/rooms/5.PNG' },
//         { id: 'double_room', guests: 2, beds: 1, icon: icons.single, image: '/imgs/rooms/4.PNG' },
//         { id: 'twin_room', guests: 2, beds: 2, icon: icons.single, image: '/imgs/rooms/1.JPG' },
//         { id: 'triple_room', guests: 3, beds: 3, icon: icons.single, image: '/imgs/rooms/3.PNG' },
//         { id: 'quad_room', guests: 4, beds: 4, icon: icons.single, image: '/imgs/rooms/2.JPG' }
//     ];
//     // 3. معالجة حالة التحميل (Loading State)
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-silk-brown"></div>
//                 <span className="ml-3 text-silk-brown font-medium">
//                     {t('loading', 'جاري تحميل الغرف...')}
//                 </span>
//             </div>
//         );
//     }
//     // 4. معالجة حالة الخطأ (Error State)
//     if (isError) {
//         return (
//             <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg m-6 border border-red-200">
//                 <h3 className="text-xl font-bold mb-2">
//                     {t('error_title', 'عذراً، حدث خطأ!')}
//                 </h3>
//                 <p className="mb-2">
//                     {t('error_rooms', 'لم نتمكن من جلب بيانات الغرف حالياً.')}
//                 </p>
//                 <span className="text-xs opacity-70">
//                     {t('technical_details', 'التفاصيل التقنية:')} {error.message}
//                 </span>
//             </div>
//         );
//     }
//     return (
//         <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
//             <div className="max-w-6xl mx-auto">

//                 {/* رأس الصفحة */}
//                 <div className="text-center mb-16">
//                     <motion.h2
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="text-4xl md:text-5xl font-bold text-silk-brown mb-4 tracking-wide"
//                     >
//                         {t('rooms_title')}
//                     </motion.h2>
//                     <div className="w-24 h-1 bg-silk-sand mx-auto rounded-full mb-4"></div>
//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                         className={`text-${currentLanguage === 'ar' ? 'xl' : "lg"} text-silk-brown/80 max-w-2xl mx-auto font-medium`}
//                     >
//                         {t('rooms_subtitle')}
//                     </motion.p>
//                 </div>

//                 {/* شبكة عرض الغرف */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {roomsData.map((room, index) => (
//                         <motion.div
//                             key={room.id}
//                             initial={{ opacity: 0, y: 30 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             whileHover={{ y: -8 }}
//                             transition={{ duration: 0.4, delay: index * 0.05 }}
//                             className="group flex flex-col justify-between bg-silk-cream border border-silk-sand/20 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-silk-sand/50 transition-all duration-300 bg-white/40 backdrop-blur-xs"
//                         >
//                             <div>
//                                 {/* حاوية الصورة */}
//                                 <div className="h-56 w-full overflow-hidden relative">
//                                     <img
//                                         src={room.image}
//                                         alt={t(`${room.id}_name`)}
//                                         className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//                                         onError={(e) => {
//                                             const target = e.target as HTMLImageElement;
//                                             target.src = "https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel";
//                                         }}
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                                 </div>

//                                 {/* محتوى الكارد النصي */}
//                                 <div className="p-6">
//                                     <div className="flex justify-between items-start mb-3">
//                                         <h3 className="text-2xl font-bold text-silk-brown group-hover:text-silk-dark transition-colors duration-300">
//                                             {t(`${room.id}_name`)}
//                                         </h3>
//                                     </div>

//                                     <p className="text-silk-dark/80 font-medium text-xl leading-relaxed mb-4 min-h-[48px]">
//                                         {t(`${room.id}_desc`)}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* أسفل الكارد: الإحصائيات، السعر وزر الحجز */}
//                             <div className="px-6 pb-6 space-y-4">
//                                 <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-t-silk-brown">

//                                     {/* الإحصائيات (الضيوف والأسرة) */}
//                                     <div className="flex items-center justify-between gap-3 w-full text-md font-bold text-silk-brown/90">
//                                         {/* عدد الأشخاص */}
//                                         <div className="flex items-center gap-1">
//                                             {room.icon}

//                                             <span>  <span className='font-arabic font-bold text-xl'>{room.guests} </span>{t('guest_count')}</span>
//                                         </div>

//                                         {/* عدد الأسرة */}
//                                         <div className="flex items-center gap-1">
//                                             {icons.bed}
//                                             <span> <span className='font-arabic font-bold text-xl'>{room.beds}</span> {t(room.beds === 1 ? 'bed_single' : 'bed_plural')}</span>
//                                         </div>
//                                     </div>

//                                     {/* السعر المترجم المستدعى ديناميكياً */}
//                                     <div className="flex items-center gap-1 text-md font-bold text-silk-brown/90  px-2 py-1 ">
//                                         {icons.price}
//                                         <span>{t(`${room.id}_price`)}</span>
//                                     </div>

//                                 </div>

//                                 <button className="w-full py-2.5 rounded-lg bg-silk-brown border border-silk-brown
//                                  text-silk-cream font-bold text-lg tracking-wider transition-all duration-300 hover:bg-silk-dark
//                                   hover:text-silk-cream hover:border-silk-brown/30 cursor-pointer">
//                                     {t('book_now')}
//                                 </button>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>

//             </div>
//         </section>
//     );
// }

// import { useTranslation } from 'react-i18next';
// import { motion } from 'framer-motion';
// import { useRooms } from '../hooks/useRooms';

// const icons = {
//     single: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
//         </svg>
//     ),
//     double: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21.75c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
//         </svg>
//     ),
//     bed: (
//         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.38-1.12-2.5-2.5-2.5H5.5A2.5 2.5 0 0 0 3 8.25v10.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75v-1.5h14v1.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V8.25ZM3.75 12h16.5M6.75 8.25h3v2.25h-3V8.25Zm7.5 0h3v2.25h-3V8.25Z" />
//         </svg>
//     ),
//     price: (
//         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
//         </svg>
//     )
// };

// export default function RoomTypes() {
//     // 1. جلب البيانات من الـ API عبر الـ Hook
//     const { data: apiRooms, isLoading, isError, error } = useRooms();
//     const { t, i18n } = useTranslation();
//     const currentLanguage = i18n.language;

//     // 2. مصفوفة الإعدادات المحلية (تستخدم لربط الأيقونات والصور الثابتة إن لم تكن قادمة من الباك إند)
//     const localRoomsConfig = {
//         single_room: { icon: icons.single, fallbackImage: '/imgs/rooms/5.PNG' },
//         double_room: { icon: icons.double, fallbackImage: '/imgs/rooms/4.PNG' },
//         twin_room: { icon: icons.double, fallbackImage: '/imgs/rooms/1.JPG' }, // تم ربط أيقونة شخصين للسرير المزدوج/المنفصل
//         triple_room: { icon: icons.double, fallbackImage: '/imgs/rooms/3.PNG' },
//         quad_room: { icon: icons.double, fallbackImage: '/imgs/rooms/2.JPG' }
//     };

//     // معالجة حالة التحميل (Loading State)
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-silk-brown"></div>
//                 <span className="ml-3 text-silk-brown font-medium">
//                     {t('loading', 'جاري تحميل الغرف...')}
//                 </span>
//             </div>
//         );
//     }

//     // معالجة حالة الخطأ (Error State)
//     if (isError) {
//         return (
//             <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg m-6 border border-red-200">
//                 <h3 className="text-xl font-bold mb-2">
//                     {t('error_title', 'عذراً، حدث خطأ!')}
//                 </h3>
//                 <p className="mb-2">
//                     {t('error_rooms', 'لم نتمكن من جلب بيانات الغرف حالياً.')}
//                 </p>
//                 <span className="text-xs opacity-70">
//                     {t('technical_details', 'التفاصيل التقنية:')} {error.message}
//                 </span>
//             </div>
//         );
//     }

//     // دمج البيانات الحية القادمة من قاعدة البيانات مع الأيقونات والصور المحلية المحددة
//     const mergedRooms = apiRooms?.map(apiRoom => {
//         const config = localRoomsConfig[apiRoom.slug] || { icon: icons.single, fallbackImage: 'https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel' };
//         return {
//             ...apiRoom,
//             icon: config.icon,
//             // استخدام رابط الصورة من السيرفر (Spatie) إن وجد، وإلا نعود للصورة المحلية الثابتة
//             displayImage: apiRoom.image || config.fallbackImage
//         };
//     }) || [];

//     return (
//         <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
//             <div className="max-w-6xl mx-auto">

//                 {/* رأس الصفحة المرتكز تماماً على الـ Translations */}
//                 <div className="text-center mb-16">
//                     <motion.h2
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="text-4xl md:text-5xl font-bold text-silk-brown mb-4 tracking-wide"
//                     >
//                         {t('rooms_title')}
//                     </motion.h2>
//                     <div className="w-24 h-1 bg-silk-sand mx-auto rounded-full mb-4"></div>
//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                         className={`text-${currentLanguage === 'ar' ? 'xl' : "lg"} text-silk-brown/80 max-w-2xl mx-auto font-medium`}
//                     >
//                         {t('rooms_subtitle')}
//                     </motion.p>
//                 </div>

//                 {/* شبكة عرض الغرف المحدثة بالـ loop الديناميكي */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {mergedRooms.map((room, index) => (
//                         <motion.div
//                             key={room.id || room.slug}
//                             initial={{ opacity: 0, y: 30 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             whileHover={{ y: -8 }}
//                             transition={{ duration: 0.4, delay: index * 0.05 }}
//                             className="group flex flex-col justify-between bg-silk-cream border border-silk-sand/20 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-silk-sand/50 transition-all duration-300 bg-white/40 backdrop-blur-xs"
//                         >
//                             <div>
//                                 {/* حاوية الصورة */}
//                                 <div className="h-56 w-full overflow-hidden relative">
//                                     <img
//                                         src={room.displayImage}
//                                         alt={room.name}
//                                         className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//                                         onError={(e) => {
//                                             const target = e.target;
//                                             target.src = "https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel";
//                                         }}
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                                 </div>

//                                 {/* محتوى الكارد النصي القادم مترجماً مباشرة من الباك إند */}
//                                 <div className="p-6">
//                                     <div className="flex justify-between items-start mb-3">
//                                         <h3 className="text-2xl font-bold text-silk-brown group-hover:text-silk-dark transition-colors duration-300">
//                                             {room.name}
//                                         </h3>
//                                     </div>

//                                     <p className="text-silk-dark/80 font-medium text-xl leading-relaxed mb-4 min-h-[48px]">
//                                         {room.description}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* أسفل الكارد: الإحصائيات، السعر وزر الحجز */}
//                             <div className="px-6 pb-6 space-y-4">
//                                 <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-t-silk-brown">

//                                     {/* الإحصائيات (الضيوف والأسرة) */}
//                                     <div className="flex items-center justify-between gap-3 w-full text-md font-bold text-silk-brown/90">
//                                         {/* عدد الأشخاص من الباك إند */}
//                                         <div className="flex items-center gap-1">
//                                             {room.icon}
//                                             <span>
//                                                 <span className='font-arabic font-bold text-xl'>{room.guests}</span>{' '}
//                                                 {t('guest_count')}
//                                             </span>
//                                         </div>

//                                         {/* عدد الأسرة من الباك إند */}
//                                         <div className="flex items-center gap-1">
//                                             {icons.bed}
//                                             <span>
//                                                 <span className='font-arabic font-bold text-xl'>{room.beds}</span>{' '}
//                                                 {t(room.beds === 1 ? 'bed_single' : 'bed_plural')}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* السعر المجلوب حياً من السيرفر مع دمج صيغة العملة لكل ليفة */}
//                                     <div className="flex items-center gap-1 text-md font-bold text-silk-brown/90 px-2 py-1">
//                                         {icons.price}
//                                         <span>
//                                             {room.price}$ / {t('per_person', 'للشخص الواحد')}
//                                         </span>
//                                     </div>

//                                 </div>

//                                 <button className="w-full py-2.5 rounded-lg bg-silk-brown border border-silk-brown
//                                    text-silk-cream font-bold text-lg tracking-wider transition-all duration-300 hover:bg-silk-dark
//                                    hover:text-silk-cream hover:border-silk-brown/30 cursor-pointer">
//                                     {t('book_now')}
//                                 </button>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>

//             </div>
//         </section>
//     );
// }


import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useRooms } from '../hooks/useRooms';
interface BookingStatus {
    is_booked: boolean;
    available_at: string | null;
}

interface ApiRoom {
    id: number;
    slug: string;
    name: string;
    description: string;
    guests: number;
    beds: number;
    price: number;
    image?: string;
    booking_status: BookingStatus; // 👈 الحقل الديناميكي الجديد من لارافيل
}

interface IMergedRooms extends ApiRoom {
    displayImage: string;
    icon: React.JSX.Element;
}
const icons = {
    single: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    double: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21.75c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
    ),
    bed: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.38-1.12-2.5-2.5-2.5H5.5A2.5 2.5 0 0 0 3 8.25v10.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75v-1.5h14v1.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V8.25ZM3.75 12h16.5M6.75 8.25h3v2.25h-3V8.25Zm7.5 0h3v2.25h-3V8.25Z" />
        </svg>
    ),
    price: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    )
};

export default function RoomTypes() {
    // إخبار الـ Hook بنوع البيانات المتوقع إرجاعها كمصفوفة من الـ Interface
    const { data: apiRooms, isLoading, isError, error } = useRooms();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    // 2. ضبط نوع مصفوفة الإعدادات لتقبل نصوص الـ slugs كمفاتيح ديناميكية
    const localRoomsConfig: Record<string, { icon: React.JSX.Element; fallbackImage: string }> = {
        single_room: { icon: icons.single, fallbackImage: '/imgs/rooms/5.PNG' },
        double_room: { icon: icons.double, fallbackImage: '/imgs/rooms/4.PNG' },
        twin_room: { icon: icons.double, fallbackImage: '/imgs/rooms/1.JPG' },
        triple_room: { icon: icons.double, fallbackImage: '/imgs/rooms/3.PNG' },
        quad_room: { icon: icons.double, fallbackImage: '/imgs/rooms/2.JPG' }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-silk-brown"></div>
                <span className="ml-3 text-silk-brown font-medium">
                    {t('loading')}
                </span>
            </div>
        );
    }
    if (isError) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto my-12 p-8 text-center bg-white/40 backdrop-blur-md rounded-2xl border border-silk-sand/30 shadow-xl"
            >
                {/* أيقونة الخطأ المصممة بألوان الموقع */}
                <div className="w-16 h-16 bg-silk-sand/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-silk-brown/20">
                    <svg className="w-8 h-8 text-silk-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                    </svg>
                </div>

                {/* العناوين والنصوص */}
                <h3 className="text-2xl font-bold text-silk-brown mb-2 tracking-wide">
                    {t('error_title', 'عذراً، حدث خطأ غير متوقع')}
                </h3>

                <p className="text-silk-dark/80 font-medium text-lg max-w-sm mx-auto mb-6 leading-relaxed">
                    {t('error_rooms', 'لم نتمكن من جلب بيانات الغرف من الواحة الخاصة بنا حالياً. يرجى المحاولة مرة أخرى.')}
                </p>

                {/* تفاصيل تقنية مخفية بشكل أنيق (تظهر بلون مطفأ جداً في الأسفل) */}
                <div className="pt-4 border-t border-silk-sand/20 text-xs text-silk-brown/60 dir-ltr font-mono">
                    {t('technical_details', 'Error:')} {error instanceof Error ? error.message : 'Connection failed'}
                </div>
            </motion.div>
        );
    }
    // 3. تمرير نوع البيانات ApiRoom داخل الـ map لحل مشكلة الإدخال الفهرسي
    const mergedRooms = apiRooms?.map((apiRoom: ApiRoom) => {
        const config = localRoomsConfig[apiRoom.slug] || {
            icon: icons.single,
            fallbackImage: 'https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel'
        };
        return {
            ...apiRoom,
            icon: config.icon,
            displayImage: apiRoom.image 
        };
    }) || [];


    return (
        <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-silk-brown mb-4 tracking-wide"
                    >
                        {t('rooms_title')}
                    </motion.h2>
                    <div className="w-24 h-1 bg-silk-sand mx-auto rounded-full mb-4"></div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`text-${currentLanguage === 'ar' ? 'xl' : "lg"} text-silk-brown/80 max-w-2xl mx-auto font-medium`}
                    >
                        {t('rooms_subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 4. تحديد نوع العناصر المدمجة (room: any أو نوع مشتق) وتحديد نوع الـ index كـ number */}
                    {mergedRooms.map((room: IMergedRooms, index: number) => (
                        <motion.div
                            key={room.id || room.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group flex flex-col justify-between bg-silk-cream border border-silk-sand/20 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-silk-sand/50 transition-all duration-300 bg-white/40 backdrop-blur-xs"
                        >
                            
                                <div className="h-56 w-full overflow-hidden relative">
                                    <div className="h-56 w-full overflow-hidden relative">
                                        {/* 🌟 شارة حالة الحجز المصممة بأناقة */}
                                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end">
                                            {room?.booking_status?.is_booked ? (
                                                <>
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-800/90 text-silk-cream backdrop-blur-xs border border-silk-sand/20 shadow-md tracking-wide">
                                                        {t('status_booked', 'محجوزة حالياً')}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/80 text-amber-950 font-mono shadow-sm">
                                                        {t('available_on', 'متاحة في:')} {room.booking_status.available_at}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800/90 text-silk-cream backdrop-blur-xs border border-emerald-600/20 shadow-md tracking-wide">
                                                    {t('status_available', 'متاحة الآن')}
                                                </span>
                                            )}
                                        </div>

                                        <img
                                            src={room.displayImage}
                                            alt={room.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel";
                                            }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-2xl font-bold text-silk-brown group-hover:text-silk-dark transition-colors duration-300">
                                                {room.name}
                                            </h3>
                                        </div>

                                        <p className="text-silk-dark/80 font-medium text-xl leading-relaxed mb-4 min-h-[48px]">
                                            {room.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-t-silk-brown">

                                        <div className="flex items-center justify-between gap-3 w-full text-md font-bold text-silk-brown/90">
                                            <div className="flex items-center gap-1">
                                                {room.icon}
                                                <span>
                                                    <span className='font-arabic font-bold text-xl'>{room.guests}</span>{' '}
                                                    {t('guest_count')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {icons.bed}
                                                <span>
                                                    <span className='font-arabic font-bold text-xl'>{room.beds}</span>{' '}
                                                    {t(room.beds === 1 ? 'bed_single' : 'bed_plural')}
                                                </span>
                                            </div>
                                        </div>
                                        {/* الكود الجديد: يستدعي الجملة النصية الكاملة من ملف الترجمة مباشرة */}
                                        <div className="flex items-center gap-1 text-md font-semibold text-silk-brown/90 px-2 py-1">
                                            {icons.price}
                                            <span className="font-medium text-base">
                                                {t(`${room.slug}_price`)}
                                            </span>
                                        </div>

                                    </div>

                                    <button className="w-full py-2.5 rounded-lg bg-silk-brown border border-silk-brown
                                   text-silk-cream font-bold text-lg tracking-wider transition-all duration-300 hover:bg-silk-dark
                                   hover:text-silk-cream hover:border-silk-brown/30 cursor-pointer">
                                        {t('book_now')}
                                    </button>
                                </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}