import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language

    return (
        <footer className="bg-silk-dark text-silk-cream pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* استبدلنا text-right بـ text-start للمحاذاة التلقائية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start">

                    {/* القسم الأول: العنوان */}
                    <div>
                        <h3 className={`text-${currentLanguage === 'ar' ? '4xl' : currentLanguage === 'en' ? '2xl' : '2xl'} text-silk-sand mb-4 `}>
                            {t('footer_hotel_name')}
                        </h3>
                        <p className={` text-${currentLanguage === 'ar' ? 'xl' : currentLanguage === 'en' ? 'md' : 'md'} leading-relaxed opacity-80 text-center md:text-start`}>
                            {t('footer_address')}
                        </p>
                    </div>

                    {/* القسم الثاني: الاتصال */}
                    <div>

                        <h3 className={` text-${currentLanguage === 'ar' ? '3xl' : currentLanguage === 'en' ? 'lg' : 'lg'} tracking-widest text-silk-sand mb-4 uppercase`}>
                            {t('footer_contact_title')}
                        </h3>
                        <div className="space-y-3  text-lg">
                            <p>
                                <span className="text-silk-sand block text-xl mb-2">{t('footer_mobile_whatsapp')}</span>

                                <a href="tel:+963982221918" className="font-arabic hover:text-silk-sand transition-colors inline-block" dir="ltr">
                                    +963 982 221 918
                                </a>
                            </p>
                            <p>
                                <span className="text-silk-sand block text-xl mb-2">{t('footer_landline')}</span>

                                <a href="tel:+963982221918" className="font-arabic hover:text-silk-sand transition-colors inline-block" dir="ltr">
                                    +963 125 930 077
                                </a>
                            </p>
                            <p>
                                <span className="text-silk-sand block text-xl mb-2">{t('footer_email')}</span>
                                <a href="mailto:info@silkroadlodge.com" className="hover:text-silk-sand transition-colors">
                                    info@silkroadlodge.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* القسم الثالث: التواصل الاجتماعي */}
                    {/* استبدلنا items-end بـ items-start */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className={` text-${currentLanguage === 'ar' ? '3xl' : currentLanguage === 'en' ? 'lg' : 'lg'} text-2xl text-silk-sand mb-4`}>
                            {t('footer_follow_us')}
                        </h3>

                        {/* حاوية الأيقونات بشكل أفقي */}
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    name: 'WhatsApp',
                                    href: 'https://wa.me/963982221918',
                                    color: 'hover:bg-[#25D366] hover:text-white',
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'Facebook',
                                    href: 'https://www.facebook.com/share/1BGX4oJ64A/?mibextid=wwXIfr', // الرابط المخصص للفوتر
                                    color: 'hover:bg-[#1877F2] hover:text-white',
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'Email',
                                    href: 'mailto:info@silkroadlodge.com',
                                    color: 'hover:bg-silk-dark hover:text-silk-cream',
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    )
                                }
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.name}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-silk-sand/10 text-silk-sand border border-silk-sand/30 shadow-sm transition-all duration-300 ${social.color}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* الخط السفلي وحقوق النشر */}
                <div className="mt-16 pt-8 border-t border-silk-sand/20 flex flex-col md:flex-row justify-between items-center text-md opacity-60">
                    <p className=" mb-4 text-center md:mb-0 md:text-left">
                        © {new Date().getFullYear()} {t('footer_copyright')}
                    </p>
                    {/* استخدمنا gap-6 بدلاً من space-x-reverse لدعم ممتاز للـ RTL و LTR */}
                    <div className="flex gap-6 font-english uppercase">
                        <a href={'https://sawagroup.co.jp'} target="_blank" rel="noopener noreferrer" className="hover:text-silk-brown transition-colors">
                            {t('footer_developed_by')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}