import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const icons = {
    single: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    double: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21 Gramc-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
    ),
    bed: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.38-1.12-2.5-2.5-2.5H5.5A2.5 2.5 0 0 0 3 8.25v10.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75v-1.5h14v1.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V8.25ZM3.75 12h16.5M6.75 8.25h3v2.25h-3V8.25Zm7.5 0h3v2.25h-3V8.25Z" />
        </svg>
    )
};

export default function RoomTypes() {
    const { t } = useTranslation();

    // مصفوفة الغرف مع إضافة مسارات الصور (قم بوضع صورك في مجلد public/images/rooms)
    const roomsData = [
        { id: 'single_room', guests: 1, beds: 1, icon: icons.single, image: '/imgs/rooms/single.jpg' },
        { id: 'double_room', guests: 2, beds: 1, icon: icons.single, image: '/imgs/rooms/double.jpg' },
        { id: 'twin_room', guests: 2, beds: 2, icon: icons.single, image: '/imgs/rooms/twin.jpg' },
        { id: 'triple_room', guests: 3, beds: 3, icon: icons.single, image: '/imgs/rooms/triple.jpg' },
        { id: 'quad_room', guests: 4, beds: 4, icon: icons.single, image: '/imgs/rooms/quad.jpg' }
    ];

    return (
        <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                {/* رأس الصفحة */}
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
                        className="text-lg text-silk-brown/80 max-w-2xl mx-auto font-medium"
                    >
                        {t('rooms_subtitle')}
                    </motion.p>
                </div>

                {/* شبكة عرض الغرف */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roomsData.map((room, index) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group flex flex-col justify-between bg-silk-cream border border-silk-sand/20 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-silk-sand/50 transition-all duration-300 bg-white/40 backdrop-blur-xs"
                        >
                            <div>
                                {/* 📸 حاوية الصورة المضافة حديثاً مع تأثير الزووم */}
                                <div className="h-56 w-full overflow-hidden relative">
                                    <img
                                        src={room.image}
                                        alt={t(`${room.id}_name`)}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        // في حال لم تكن الصورة جاهزة بعد، هذا الكود يمنع ظهور فراغ قبيح ويستبدله بلون الحرير الفخم
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel";
                                        }}
                                   />
                                    {/* طبقة تظليل جمالية ناعمة أسفل الصورة */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                {/* محتوى الكارد النصي */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-2xl font-bold text-silk-dark group-hover:text-silk-brown transition-colors duration-300">
                                            {t(`${room.id}_name`)}
                                        </h3>
                                    </div>

                                    <p className="text-silk-dark/80 font-medium text-sm leading-relaxed mb-4 min-h-[48px]">
                                        {t(`${room.id}_desc`)}
                                    </p>
                                </div>
                            </div>

                            {/* أسفل الكارد: الإحصائيات وزر الحجز */}
                            <div className="px-6 pb-6 space-y-4">
                                <div className="flex items-center gap-5 text-xs font-bold text-silk-brown/90 pt-3 border-t border-silk-sand/15">
                                    {/* عدد الأشخاص */}
                                    <div className="flex items-center gap-1">
                                        {room.icon}
                                        <span>{room.guests} {t('guest_count')}</span>
                                    </div>

                                    {/* عدد الأسرة */}
                                    <div className="flex items-center gap-1">
                                        {icons.bed}
                                        <span>{room.beds} {t(room.beds === 1 ? 'bed_single' : 'bed_plural')}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 rounded-lg bg-transparent border border-silk-brown/30 text-silk-brown font-bold text-xs tracking-wider transition-all duration-300 hover:bg-silk-brown hover:text-silk-cream hover:border-silk-brown cursor-pointer">
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