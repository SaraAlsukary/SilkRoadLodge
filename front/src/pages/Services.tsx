import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// استيراد الأيقونات
const icons = {
    tent: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    ),
    safari: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.25 8.25 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
    ),
    bike: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.022 13.181A6 6 0 1 1 12 4c.58 0 1.144.082 1.683.235m-1.868 12.94a6 6 0 1 1-6.18-6.18m12.36 0a6 6 0 1 1-6.18 6.18M18 9h.008v.008H18V9Z" />
        </svg>
    ),
    airport: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
        </svg>
    ),
    tour: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.213a1.24 1.24 0 0 0-1.006 0L3.622 5.683c-.381.19-.622.58-.622 1.006v11.123c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
    )
};

export default function Services() {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language
    // إضافة روابط الصور إلى كل خدمة
    const servicesData = [
        {
            id: 'bedouin_tent',
            icon: icons.tent,
            image: './imgs/services/3.jpg'
        },
        {
            id: 'safari_tour',
            icon: icons.safari,
            image: './imgs/services/5.jpg'

        },
        {
            id: 'bicycles',
            icon: icons.bike,
            image: './imgs/services/1.jpg'
        },
        {
            id: 'airport_pickup',
            icon: icons.airport,
            image: './imgs/services/4.png'

        },
        {
            id: 'syria_tour',
            icon: icons.tour,
            image: './imgs/services/2.jpg'

        }
    ];

    return (
        <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* رأس الصفحة الأنيق */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-silk-brown mb-4 tracking-wide"
                    >
                        {t('services_title')}
                    </motion.h2>
                    <div className="w-24 h-1 bg-silk-sand mx-auto rounded-full mb-4"></div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className={`${currentLang === 'ar' ? "text-2xl":"text-xl"} text-silk-brown/80 max-w-2xl mx-auto font-medium`}
                    >
                        {t('services_subtitle')}
                    </motion.p>
                </div>

                {/* شبكة عرض الخدمات مع الصور */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, boxShadow: '0 25px 30px -5px rgba(139, 94, 60, 0.15)' }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group relative flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-silk-sand/20"
                        >
                            {/* حاوية الصورة مع تأثير التكبير */}
                            <div className="relative h-64 w-full overflow-hidden">
                                {/* طبقة شفافة داكنة لزيادة تباين الألوان تختفي عند التمرير */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                <img
                                    src={service.image}
                                    alt={t(`${service.id}_title`)}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* محتوى البطاقة */}
                            <div className="flex flex-col flex-grow p-8 pt-10 relative bg-silk-cream">
                                {/* الأيقونة العائمة (Floating Icon) */}
                                <div className="absolute -top-8 right-8 rtl:left-8 rtl:right-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-silk-brown text-silk-cream border-4 border-silk-cream transition-transform duration-300 group-hover:-translate-y-2 shadow-lg z-20">
                                    {service.icon}
                                </div>

                                {/* عنوان الخدمة */}
                                <h3 className="text-2xl font-bold text-silk-dark mb-3 group-hover:text-silk-brown transition-colors duration-300">
                                    {t(`${service.id}_title`)}
                                </h3>

                                {/* وصف الخدمة */}
                                <p className="text-silk-dark/80 leading-relaxed font-medium text-xl mb-6 flex-grow">
                                    {t(`${service.id}_description`)}
                                </p>

                                {/* زر التفاصيل بشكل عصري ومدمج */}
                                {/* <div className="pt-5 border-t border-silk-sand/30 mt-auto">
                                    <span className="inline-flex items-center gap-2 text-xl font-bold text-silk-sand group-hover:text-silk-brown transition-colors duration-300 cursor-pointer uppercase tracking-wider">
                                        {t('service_more_details') || 'Read More'}
                                        <span className="transition-transform duration-300 group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
                                            →
                                        </span>
                                    </span>
                                </div> */}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}