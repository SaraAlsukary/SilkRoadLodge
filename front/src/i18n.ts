import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector) // الأداة المسؤولة عن اكتشاف اللغة
    .use(initReactI18next)
    .init({
        supportedLngs: ['ar', 'en', 'ja'], // اللغات المدعومة في موقعك
        fallbackLng: 'en', // اللغة الافتراضية إذا كانت لغة جهاز المستخدم غير مدعومة (مثل الفرنسية)

        // إجبار المكتبة على أخذ الجزء الأول من اللغة فقط (مثلاً en-US تصبح en)
        load: 'languageOnly',

        detection: {
            // الترتيب الذي سيبحث فيه النظام عن اللغة
            // يبدأ بـ localStorage ليرى إذا كان المستخدم قد اختار لغة يدوياً سابقاً
            // ثم navigator وهي لغة متصفح/جهاز المستخدم
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