import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    "/imgs/10.jpeg",
    "/imgs/5.jpeg", // أضيفي مسارات صورك هنا
    "/imgs/3.jpeg",
    "/imgs/11.jpeg"
];

const About = () => {
    const [index, setIndex] = useState(0);

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
                <div className="relative p-2 border-2 border-silk-sand/30 -rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
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
                    <h2 className="font-arabic text-4xl text-silk-dark text-right">قصة طريق الحرير</h2>
                    <p className="font-arabic text-lg text-silk-dark/80 leading-loose text-right">
                        في فندق طريق الحرير، لا نقدم مجرد غرف للنوم، بل نقدم تجربة للعودة بالزمن.
                        كل زاوية في فندقنا تحكي حكاية من حكايات تدمر العريقة.
                    </p>
                    <NavLink to={'/about'} className="inline-block text-silk-brown font-english tracking-widest border-b border-silk-brown hover:text-silk-dark transition-all cursor-pointer">
                        اقرأ المزيد
                    </NavLink>
                </div>

            </div>
        </section>
    );
}

export default About;