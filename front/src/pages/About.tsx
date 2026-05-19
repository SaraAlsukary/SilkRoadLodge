export default function About() {
    return (
        <section className="py-10 px-6 bg-silk-cream">
            <div className="max-w-4xl mx-auto text-center">
                <img src="/logo.png" alt="" className='w-[400px] h-[400px] mx-auto mb-10' />

                {/* عنوان القسم */}
                <h2 className="font-arabic text-4xl md:text-5xl text-silk-dark mb-10">
                    قصة فندق طريق الحرير
                </h2>

                {/* الفقرة النصية بتنسيق مريح */}
                <div className="relative">
                    {/* زخرفة بسيطة فوق النص */}
                    <div className="text-silk-sand text-3xl mb-6">❝</div>

                    <p className="text-right font-arabic text-xl md:text-2xl text-silk-dark/80 leading-relaxed md:leading-loose text-justify">
                        في جوف بادية تدمر، حيث تعانق رمال الزمن حكايات العراقة، يبرز 'فندق طريق الحرير' كواحةٍ سُكبت فيها روح الماضي في قوالب الحاضر. نحن هنا لسنا مجرد وجهة للإقامة، بل بوابةٌ تعبر بك عبر القوافل القديمة التي جابت أصقاع الأرض لتجعل من تدمر قبلةً للجمال والتبادل الإنساني. إن كل حجرٍ في رحابنا يحكي قصة صمود الأعمدة، وكل زاويةٍ في أروقتنا تنبض بهدوءٍ لا يقطعه إلا حفيف الرياح السورية العليلة. حين تختار الإقامة لدينا، فإنك لا تستأجر غرفة، بل تستضيف التاريخ في مسكنٍ يمزج بين دقة التصميم التراثي ودفء الضيافة السورية الأصيلة
                    </p>

                    {/* زخرفة بسيطة تحت النص */}
                    <div className="text-silk-sand text-3xl mt-6 rotate-180">❝</div>
                </div>

                {/* رابط إضافي بأسلوب أنيق */}
                <button className="mt-12 font-english text-silk-brown hover:text-silk-dark border-b border-silk-brown transition-all duration-300 tracking-[0.2em]">
                    {/* DISCOVER OUR HERITAGE */}
                    اكتشف تراثنا
                </button>
            </div>
        </section>
    );
}