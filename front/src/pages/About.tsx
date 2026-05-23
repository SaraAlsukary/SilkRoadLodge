import { useTranslation } from 'react-i18next';

export default function About() {
    const { t } = useTranslation();

    return (
        <section className="py-10 px-6 bg-silk-cream">
            <div className="max-w-4xl mx-auto text-center">
                <img src="/logo.png" alt="Silk Road Lodge Logo" className='w-[400px] h-[400px] mx-auto mb-10' />

                {/* عنوان القسم */}
                <h2 className=" text-4xl md:text-5xl text-silk-dark mb-10">
                    {t('about_title')}
                </h2>

                {/* الفقرة النصية بتنسيق مريح */}
                <div className="relative">
                    {/* زخرفة بسيطة فوق النص */}
                    <div className="text-silk-sand text-3xl mb-6">❝</div>

                    {/* استخدام text-start بدلاً من text-right ليتوافق مع جميع اللغات */}
                    <p className="text-start  text-xl md:text-2xl text-silk-dark/80 leading-relaxed md:leading-loose text-justify">
                        {t('about_desc')}
                    </p>

                    {/* زخرفة بسيطة تحت النص */}
                    <div className="text-silk-sand text-3xl mt-6 rotate-180">❝</div>
                </div>

                {/* رابط إضافي بأسلوب أنيق */}
                <button className="mt-12 font-english text-silk-brown hover:text-silk-dark border-b border-silk-brown transition-all duration-300 tracking-[0.2em] uppercase">
                    {t('about_btn')}
                </button>
            </div>
        </section>
    );
}