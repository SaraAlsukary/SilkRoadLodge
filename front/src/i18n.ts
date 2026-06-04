import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector) // الأداة المسؤولة عن اكتشاف اللغة
    .use(initReactI18next)
    .init({
        // اللغات المدعومة في موقعك بالكامل
        supportedLngs: ['ar', 'en', 'ja', 'es', 'fr', 'zh'],

        fallbackLng: 'en', // اللغة الافتراضية

        // التعديل السحري هنا: يضمن تحميل الرمز بالكامل (مثل zh-CN) دون قصه
        load: 'currentOnly',

        // تحويل الرموز القادمة من المتصفح لتطابق الحروف (مثل إرجاع zh-cn إلى zh-CN القياسية)
        cleanCode: true,

        detection: {
            // الترتيب الذي سيبحث فيه النظام عن اللغة
            order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

            // أين سيتم حفظ لغة المستخدم إذا قام بتغييرها يدوياً
            caches: ['localStorage'],
        },

        interpolation: {
            escapeValue: false, // غير مطلوب مع React
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // مسار ملفات الترجمة
        },
    });

export default i18n;