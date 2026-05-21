import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function FloatingSocials() {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    // بيانات وسائل التواصل
    const socialLinks = [
        {
            name: 'WhatsApp',
            href: 'https://wa.me/963995492228',
            color: 'hover:bg-[#25D366] hover:text-white', // لون واتساب الرسمي
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            )
        },
        {
            name: 'Facebook',
            href: '',
            color: 'hover:bg-[#1877F2] hover:text-white', // لون فيسبوك الرسمي
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            )
        },
        {
            name: 'Email',
            href: 'mailto:info@silkroadlodge.com',
            color: 'hover:bg-silk-dark hover:text-silk-cream',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    // إعدادات الأنيميشن للحاوية والأزرار
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        },
        exit: {
            opacity: 0,
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        show: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.8 }
    };

    return (
        <div className={`fixed bottom-40 ltr:right-4 z-[90] flex flex-col items-center gap-4 ltr ${currentLanguage === 'ar' ? "right-4" : ""}`}>
            {/* قائمة الأيقونات المنبثقة */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="flex flex-col gap-3"
                    >
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.name}
                                variants={itemVariants}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={social.name}
                                // التصميم الأساسي للأيقونة قبل الـ Hover
                                className={`w-12 h-12 flex items-center justify-center rounded-full bg-silk-cream text-silk-brown border border-silk-sand shadow-lg transition-colors duration-300 ${social.color}`}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* الزر الرئيسي (زر الفتح والإغلاق) */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 flex items-center cursor-pointer justify-center rounded-full bg-silk-brown text-silk-cream shadow-xl border-2 border-silk-cream focus:outline-none"
            >
                {/* استخدام AnimatePresence للتبديل الناعم بين الرسالة وعلامة X */}
                <AnimatePresence mode="wait" initial={false} >
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* أيقونة X */}
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* أيقونة الرسالة الأنيقة */}
                            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

        </div>
    );
}