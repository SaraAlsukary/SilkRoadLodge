import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
            {/* أيقونة تعبيرية أو زخرفية */}
            <div className="text-silk-sand text-8xl mb-6 opacity-50">
                404
            </div>

            {/* العنوان والرسالة */}
            <h2 className="font-arabic text-4xl text-silk-dark mb-4">
               ! عذراً، هذه البوابة لم تعد موجودة
            </h2>
            <p className="font-arabic text-lg text-silk-dark/70 mb-10 max-w-md">
                يبدو أنك ضللت الطريق في رحلتك عبر أروقة الفندق. لا تقلق، يمكنك العودة إلى واحتنا الرئيسية بضغطة زر
            </p>

            {/* زر العودة للرئيسية */}
            <Link
                to="/"
                className="px-8 py-3 border border-silk-brown text-silk-brown font-arabic text-xl transition-all duration-300 hover:bg-silk-brown hover:text-silk-cream"
            >
                العودة إلى المسار الرئيسي
            </Link>
        </section>
    );
}