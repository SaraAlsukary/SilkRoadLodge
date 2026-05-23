import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // إضافة الاستيراد

const images = [
    "/imgs/10.jpeg",
    "/imgs/5.jpeg",
    "/imgs/3.jpeg",
    "/imgs/11.jpeg"
];

const AboutSnippet = () => { // قمت بتغيير الاسم قليلاً لتجنب التعارض إذا كان في نفس الملف، يمكنك إعادته إلى About إذا كان في ملف منفصل
    const [index, setIndex] = useState(0);
    const { t, i18n } = useTranslation(); // تفعيل الترجمة
    const currentLanguage = i18n.language;
    // منطق التبديل التلقائي كل 4 ثوانٍ
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 px-6 bg-silk-cream">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

                {/* الجانب الصوري المتغير */}
                <div className="relative p-2 border-2 border-silk-sand/30 rotate-0 md:-rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={images[index]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            src={images[index]}
                            alt="About Hotel"
                            className="w-full h-80 object-cover grayscale-[20%]"
                        />
                    </AnimatePresence>
                </div>

                {/* الجانب النصي */}
                <div className="space-y-6">
                    {/* استخدام text-start ليتوافق مع جميع اللغات */}
                    <h2 className={`ont-arabic text-${currentLanguage === 'ar' ? '4xl' : currentLanguage === 'en' ? 'xl' : 'xl'} text-silk-dark text-start font-bold`}>
                        {t('home_about_title')}
                    </h2>
                    <p className=" text-md text-silk-dark/80 leading-loose text-start">
                        {t('home_about_desc')}
                    </p>
                    {/* محاذاة الزر لتتناسب مع بداية النص */}
                    <div className="text-start">
                        <NavLink to={'/about'} className="inline-block text-silk-brown font-english uppercase tracking-widest border-b border-silk-brown hover:text-silk-dark transition-all cursor-pointer">
                            {t('home_about_btn')}
                        </NavLink>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default AboutSnippet;