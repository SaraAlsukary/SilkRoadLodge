import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-silk-dark text-silk-cream pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* استبدلنا text-right بـ text-start للمحاذاة التلقائية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start">

                    {/* القسم الأول: العنوان */}
                    <div>
                        <h3 className="font-arabic text-2xl text-silk-sand mb-4 ">
                            {t('footer_hotel_name')}
                        </h3>
                        <p className="font-arabic text-sm leading-relaxed opacity-80 text-center md:text-start">
                            {t('footer_address')}
                        </p>
                    </div>

                    {/* القسم الثاني: الاتصال */}
                    <div>
                        <h3 className="font-arabic text-lg tracking-widest text-silk-sand mb-4 uppercase">
                            {t('footer_contact_title')}
                        </h3>
                        <div className="space-y-3 font-arabic text-sm">
                            <p>
                                <span className="text-silk-sand block text-sm">{t('footer_mobile_whatsapp')}</span>
                                {/* اتجاه الأرقام يفضل أن يبقى LTR دائماً لتجنب تشوه الأرقام الدولية */}
                                <a href="tel:+963995492228" className="hover:text-silk-sand transition-colors inline-block" dir="ltr">
                                    +963 (0) 995 492 228
                                </a>
                            </p>
                            <p>
                                <span className="text-silk-sand block text-sm">{t('footer_landline')}</span>
                                <a href="tel:+963125930077" className="hover:text-silk-sand transition-colors inline-block" dir="ltr">
                                    +963 (0) 125 930 077
                                </a>
                            </p>
                            <p>
                                <span className="text-silk-sand block text-sm">{t('footer_email')}</span>
                                <a href="mailto:info@silkroadlodge.com" className="hover:text-silk-sand transition-colors">
                                    info@silkroadlodge.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* القسم الثالث: التواصل الاجتماعي */}
                    {/* استبدلنا items-end بـ items-start */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-arabic text-2xl text-silk-sand mb-4">
                            {t('footer_follow_us')}
                        </h3>
                        <a
                            href="https://www.facebook.com/share/v/1Bm2z3HshV/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-silk-sand/10 border border-silk-sand/30 px-6 py-2 rounded-sm hover:bg-silk-sand hover:text-silk-dark transition-all duration-300 uppercase"
                        >
                            Facebook
                        </a>
                    </div>

                </div>

                {/* الخط السفلي وحقوق النشر */}
                <div className="mt-16 pt-8 border-t border-silk-sand/20 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
                    <p className="font-arabic mb-4 md:mb-0">
                        © {new Date().getFullYear()} {t('footer_copyright')}
                    </p>
                    {/* استخدمنا gap-6 بدلاً من space-x-reverse لدعم ممتاز للـ RTL و LTR */}
                    <div className="flex gap-6 font-english uppercase">
                        <span>{t('footer_developed_by')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}