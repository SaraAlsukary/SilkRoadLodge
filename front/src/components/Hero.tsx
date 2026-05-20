import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

// قائمة الصور الخاصة بالفندق (ضعي هنا روابط صورك)
const images = [
    "/imgs/1.jpeg",
    "/imgs/2.jpeg",
    "/imgs/3.jpeg",
    "/imgs/4.jpeg",
    "/imgs/5.jpeg",
    "/imgs/6.jpeg",
    "/imgs/7.jpeg",
    "/imgs/8.jpeg",
    "/imgs/9.jpeg",
    "/imgs/10.jpeg",
    "/imgs/11.jpeg",
];

export default function Home() {
    const [index, setIndex] = useState(0);

    // منطق تغيير الصور تلقائياً
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-100 md:h-screen overflow-hidden">

            {/* 1. طبقة الصور المتغيرة */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${images[index]})` }}
                    />
                </AnimatePresence>
                {/* طبقة التعتيم */}
                <div className="absolute inset-0 bg-silk-dark/80"></div>
            </div>

            {/* 2. طبقة المحتوى (النصوص والزر) */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-silk-cream px-4">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="font-arabic text-4xl md:text-7xl mb-8 leading-tight"
                >
                    استعد ذكريات قوافل الحرير <br />
                    <span className="text-silk-sand">واسترخِ في واحة من التاريخ</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="font-arabic text-xl md:text-2xl opacity-90 mb-12 max-w-2xl"
                >
                    في قلب تدمر، حيث تهمس الرمال بقصص الأجداد، ننتظرك لتكتب معنا فصلاً جديداً من الراحة والهدوء
                </motion.p>
                <NavLink to={'/rooms'}>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 1 }}
                        className="group relative px-10 py-4 border cursor-pointer border-silk-sand text-silk-cream font-arabic text-xl transition-all duration-500 overflow-hidden hover:text-silk-dark"
                    >
                        <span className="relative z-10">ابدأ رحلتك معنا</span>
                        <div className="absolute inset-0 bg-silk-sand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
                    </motion.div>
                </NavLink>
            </div>

        </section>
    );
}