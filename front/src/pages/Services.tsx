import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// استيراد الأيقونات (يمكنك استخدام Lucide React أو تخصيص الـ SVGs كما فعلنا هنا لتجنب المكاتب الزائدة)
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
    const { t } = useTranslation();

    // مصفوفة البيانات الخاصة بالخدمات الخمس مع مفاتيح الترجمة والأيقونات المخصصة
    const servicesData = [
        { id: 'bedouin_tent', icon: icons.tent },
        { id: 'safari_tour', icon: icons.safari },
        { id: 'bicycles', icon: icons.bike },
        { id: 'airport_pickup', icon: icons.airport },
        { id: 'syria_tour', icon: icons.tour }
    ];

    return (
        <section className="min-h-screen py-20 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

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
                        className="text-lg text-silk-brown/80 max-w-2xl mx-auto font-medium"
                    >
                        {t('services_subtitle')}
                    </motion.p>
                </div>

                {/* شبكة عرض الخدمات (Grid Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(139, 94, 60, 0.1)' }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group relative flex flex-col justify-between p-8 bg-silk-cream border border-silk-sand/30 rounded-lg shadow-sm overflow-hidden backdrop-blur-sm"
                        >
                            {/* لمسة ديكورية خلفية تناسب روح طريق الحرير الكلاسيكية */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-silk-sand/5 rounded-bl-full transition-all duration-300 group-hover:bg-silk-sand/10"></div>

                            <div>
                                {/* حاوية الأيقونة */}
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-silk-brown text-silk-cream border border-silk-sand mb-6 transition-transform duration-300 group-hover:scale-110 shadow-md">
                                    {service.icon}
                                </div>

                                {/* عنوان الخدمة */}
                                <h3 className="text-2xl font-bold text-silk-dark mb-3 group-hover:text-silk-brown transition-colors duration-300">
                                    {t(`${service.id}_title`)}
                                </h3>

                                {/* وصف الخدمة */}
                                <p className="text-silk-dark/80 leading-relaxed font-medium mb-6">
                                    {t(`${service.id}_description`)}
                                </p>
                            </div>

                            {/* زر تفاصيل اختياري أسفل الكارد ليعطي لمسة فندقية فخمة */}
                            <div className="pt-4 border-t border-silk-sand/20 flex justify-end">
                                <span className="text-sm font-bold text-silk-sand group-hover:text-silk-brown transition-colors duration-300 cursor-pointer flex items-center gap-1">
                                    {t('service_more_details')}
                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}