import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useRooms } from '../hooks/useRooms';
import { NavLink } from 'react-router-dom';

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
    booking_status: BookingStatus;
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
    const { data: apiRooms, isLoading, isError, error } = useRooms();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

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
                <span className="mx-3 text-silk-brown font-medium">{t('loading')}</span>
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
                <div className="w-16 h-16 bg-silk-sand/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-silk-brown/20">
                    <svg className="w-8 h-8 text-silk-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-silk-brown mb-2 tracking-wide">{t('error_title', 'عذراً، حدث خطأ غير متوقع')}</h3>
                <p className="text-silk-dark/80 font-medium text-lg max-w-sm mx-auto mb-6 leading-relaxed">
                    {t('error_rooms', 'لم نتمكن من جلب بيانات الغرف من الواحة الخاصة بنا حالياً. يرجى المحاولة مرة أخرى.')}
                </p>
                <div className="pt-4 border-t border-silk-sand/20 text-xs text-silk-brown/60 dir-ltr font-mono">
                    {t('technical_details', 'Error:')} {error instanceof Error ? error.message : 'Connection failed'}
                </div>
            </motion.div>
        );
    }

    const mergedRooms = apiRooms?.map((apiRoom: ApiRoom) => {
        const config = localRoomsConfig[apiRoom.slug] || {
            icon: icons.single,
            fallbackImage: 'https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel'
        };
        return {
            ...apiRoom,
            icon: config.icon,
            displayImage: apiRoom.image || config.fallbackImage
        };
    }) || [];

    return (
        <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-16">
                    <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-silk-brown mb-4 tracking-wide">
                        {t('rooms_title')}
                    </motion.h2>
                    <div className="w-24 h-1 bg-silk-sand mx-auto rounded-full mb-4"></div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`text-${currentLanguage === 'ar' ? 'xl' : "lg"} text-silk-brown/80 max-w-2xl mx-auto font-medium`}>
                        {t('rooms_subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mergedRooms.map((room: IMergedRooms, index: number) => {
                        return (
                            <motion.div
                                key={room.id || room.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                // 1. أضفنا (flex flex-col h-full) للكارد الأب ليقبل التمدد بشكل سليم
                                className="group bg-[#49392a] border border-silk-sand/70  rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-silk-sand/50 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* قسم الصورة */}
                                {/* 2. أضفنا shrink-0 لمنع الصورة من الانكماش إذا طال النص جداً */}
                                <div className="h-56 w-full shrink-0 overflow-hidden relative">
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

                                {/* الحاوية الرئيسية للمحتوى */}
                                {/* 3. أضفنا flex-grow لتأخذ باقي مساحة الكارد */}
                                <div className="text-[#f6dbbc] flex flex-col flex-grow">

                                    {/* القسم العلوي: العنوان والوصف */}
                                    {/* 4. أضفنا flex-grow هنا ليتكفل هذا القسم بملء أي فراغ ويدفع ما تحته للأسفل */}
                                    <div className="p-5 pb-2 flex-grow">
                                        <div className="mb-2">
                                            <h3 className="text-2xl font-bold">
                                                {room.name}
                                            </h3>
                                        </div>
                                        <p className="font-medium text-xl leading-relaxed">
                                            {room.description}
                                        </p>
                                    </div>

                                    {/* القسم السفلي: الأيقونات والزر مع التدرج اللوني */}
                                    {/* 5. أضفنا mt-auto لضمان التصاقه بالأسفل، و shrink-0 لمنع انكماشه */}
                                    <div className="p-5 bg-gradient-to-b from-[#49392a] to-[#f6dbbc]/80 backdrop-blur-sm mt-auto shrink-0">

                                        {/* 3. الخط والأيقونات */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-4 border-t border-white/20">
                                            <div className="flex items-center justify-between gap-3 w-full text-md font-bold">
                                                <div className="flex items-center gap-1">
                                                    {room.icon}
                                                    <span>
                                                        <span className='font-arabic font-bold text-xl'>{room.guests}</span>{' '}{t('guest_count')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {icons.bed}
                                                    <span>
                                                        <span className='font-arabic font-bold text-xl'>{room.beds}</span>{' '}{t(room.beds === 1 ? 'bed_single' : 'bed_plural')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-md font-semibold px-2 py-1">
                                                {icons.price}
                                                <span className="font-medium text-base">
                                                    {t(`${room.slug}_price`)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 4. الزر */}
                                        <div>
                                            <NavLink
                                                to={`/booking?room=${room.id}`}
                                                className="block text-center w-full py-2.5 rounded-lg bg-silk-brown border border-silk-brown text-silk-cream font-bold text-lg tracking-wider transition-all duration-300 hover:bg-silk-dark hover:text-silk-cream hover:border-silk-brown/30 cursor-pointer"
                                            >
                                                {t('book_now', 'احجز الآن')}
                                            </NavLink>
                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
//  <div className="p-6 flex-grow">
//                                     <div className="flex justify-between items-start mb-3">
//                                         <h3 className="text-2xl font-bold text-silk-brown group-hover:text-silk-dark transition-colors duration-300">
//                                             {room.name}
//                                         </h3>
//                                     </div>
//                                     <p className="text-silk-dark/80 font-medium text-xl leading-relaxed mb-4 min-h-[48px]">
//                                         {room.description}
//                                     </p>
//                                 </div>

//                                 <div className="px-6 pb-6 space-y-4">
//                                     <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-t-silk-brown">
//                                         <div className="flex items-center justify-between gap-3 w-full text-md font-bold text-silk-brown/90">
//                                             <div className="flex items-center gap-1">
//                                                 {room.icon}
//                                                 <span>
//                                                     <span className='font-arabic font-bold text-xl'>{room.guests}</span>{' '}{t('guest_count')}
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center gap-1">
//                                                 {icons.bed}
//                                                 <span>
//                                                     <span className='font-arabic font-bold text-xl'>{room.beds}</span>{' '}{t(room.beds === 1 ? 'bed_single' : 'bed_plural')}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center gap-1 text-md font-semibold text-silk-brown/90 px-2 py-1">
//                                             {icons.price}
//                                             <span className="font-medium text-base">
//                                                 {t(`${room.slug}_price`)}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* 🌟 الزر يظل متاحاً دائماً ليسمح بالحجوزات المستقبلية */}
//                                     <NavLink
//                                         to={`/booking?room=${room.id}`}
//                                         className="block text-center w-full py-2.5 rounded-lg bg-silk-brown border border-silk-brown text-silk-cream font-bold text-lg tracking-wider transition-all duration-300 hover:bg-silk-dark hover:text-silk-cream hover:border-silk-brown/30 cursor-pointer"
//                                     >
//                                         {t('book_now', 'احجز الآن')}
//                                     </NavLink>
//                                 </div>