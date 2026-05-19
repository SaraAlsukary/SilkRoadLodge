import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "الرئيسية", href: "/" },
        { name: "الغرف", href: "/rooms" },
        { name: "عن الفندق", href: "/about" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-silk-cream/90 backdrop-blur-md border-b border-silk-sand/30 shadow-sm">
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
                    <nav className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                className={({ isActive }) =>
                                    `font-arabic text-lg transition-all duration-300 relative ${isActive ? 'text-silk-brown font-bold' : 'text-silk-dark hover:text-silk-brown'}`
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
                    </nav>

                    {/* زر الحجز */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                        <NavLink to={'/rooms'} className="bg-silk-brown text-silk-cream px-6 py-2 rounded-sm font-arabic text-lg hover:bg-silk-sand hover:text-silk-dark transition-all">
                            احجز الآن
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
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block font-arabic text-xl py-2 text-silk-dark"
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* زر الحجز */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-4 text-center">
                            <NavLink to={'/rooms'} className="bg-silk-brown text-silk-cream px-6 py-2 rounded-sm font-arabic text-lg hover:bg-silk-sand hover:text-silk-dark transition-all">
                                احجز الآن
                            </NavLink>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}