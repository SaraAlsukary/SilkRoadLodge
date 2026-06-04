import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false); // حالة القائمة المنسدلة للغات
    const { t, i18n } = useTranslation();
    const langMenuRef = useRef<HTMLDivElement>(null);

    // قائمة اللغات المحدثة بالمسميات الصحيحة لكل لغة وتدعم الإضافات الجديدة
    const languages = [
        { code: "ar", name: "العربية" },
        { code: "en", name: "English" },
        { code: "fr", name: "Français" },
        { code: "es", name: "Español" },
        { code: "zh", name: "简体中文" },
        { code: "ja", name: "日本語" },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Element)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsLangMenuOpen(false); // إغلاق قائمة اللغات بعد الاختيار
        setIsOpen(false);         // إغلاق قائمة الهاتف المحمول بعد اختيار اللغة
    };

    const navLinks = [
        { name: t("home"), href: "/" },
        { name: t("about"), href: "/about" },
        { name: t("rooms"), href: "/rooms" },
        { name: t("services_title"), href: "/services" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-silk-cream/90 backdrop-blur-md border-b border-silk-sand/30 shadow-sm ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">

                    {/* اللوجو */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center"
                    >
                        <span className="font-arabic text-2xl text-silk-dark leading-none">فندق طريق الحرير</span>
                        <span className="font-english text-xs text-silk-brown tracking-[0.2em] mt-1">SILK ROAD LODGE</span>
                    </motion.div>

                    {/* القائمة للشاشات الكبيرة */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                className={({ isActive }) =>
                                    ` ${i18n.language === 'ar' ? 'text-2xl' : ' text-lg'} transition-all duration-300 relative ${isActive ? 'text-silk-brown font-bold' : 'text-silk-dark hover:text-silk-brown'}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        {isActive && (
                                            <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-silk-brown" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}

                        {/* قائمة اللغات المنسدلة الدائمة التوسع (Dropdown) */}
                        <div className="relative mx-2" ref={langMenuRef}>
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="flex items-center gap-1.5 text-silk-dark hover:text-silk-brown transition-colors py-2"
                            >
                                {/* أيقونة الكرة الأرضية */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <span className="font-english text-sm uppercase font-medium">{i18n.language}</span>
                                {/* سهم يتغير اتجاهه */}
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* القائمة المنسدلة */}
                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full mt-2 w-32 bg-silk-cream border border-silk-sand/50 shadow-lg rounded-sm py-2 z-50 left-1/2 -translate-x-1/2"
                                    >
                                        {languages.map((lng) => (
                                            <button
                                                key={lng.code}
                                                onClick={() => changeLanguage(lng.code)}
                                                className={`w-full text-start px-4 py-2 text-xl transition-colors ${i18n.language === lng.code
                                                    ? 'bg-silk-brown/10 text-silk-brown font-bold'
                                                    : 'text-silk-dark hover:bg-silk-sand/30 hover:text-silk-brown'
                                                    }`}
                                            >
                                                {lng.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* زر الحجز */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                        <NavLink to={'/rooms'} className={`bg-silk-brown text-silk-cream px-6 py-2  ${i18n.language === 'ar' ? 'text-xl' : ' text-lg'} rounded-sm font-arabic hover:bg-silk-sand hover:text-silk-dark transition-all`}>
                            {t("book_now") || "احجز الآن"}
                        </NavLink>
                    </motion.div>

                    {/* زر الموبايل */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-silk-dark focus:outline-none">
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* قائمة الموبايل مع Animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-silk-cream border-b border-silk-sand overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4 text-center">
                            {/* روابط القائمة */}
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-xl py-2 text-silk-dark"
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {/* منطقة اللغات في الموبايل (مصممة لتستوعب وتناسب أي لغة باسمها الصحيح) */}
                            <div className="pt-4 mt-2 border-t border-silk-sand/30">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {languages.map((lng) => (
                                        <button
                                            key={lng.code}
                                            onClick={() => changeLanguage(lng.code)}
                                            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${i18n.language === lng.code
                                                ? 'bg-silk-brown text-silk-cream font-bold'
                                                : 'border border-silk-sand text-silk-dark hover:border-silk-brown'
                                                }`}
                                        >
                                            {lng.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* زر الحجز */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-4">
                                <NavLink to={'/rooms'} onClick={() => setIsOpen(false)} className="bg-silk-brown text-silk-cream px-6 py-3 rounded-sm font-arabic text-lg block">
                                    {t("book_now") || "احجز الآن"}
                                </NavLink>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}