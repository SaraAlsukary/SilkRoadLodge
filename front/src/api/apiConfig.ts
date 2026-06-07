// src/Api/apiConfig.js
import axios from 'axios';
import i18n from 'i18next'; // استيراد i18n مباشرة لقراءة اللغة الحالية لقاعدة البيانات

// 1. إنشاء نسخة مخصصة من Axios الإعدادات الأساسية
const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api', // الرابط الأساسي للـ API الخاص بكِ
    // baseURL: 'http://88.223.92.93:8080/api',
    baseURL: 'https://silkroadlodge.com/api',
    timeout: 10000, // وقت حدوث مهلة للطلب (10 ثوانٍ)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 2. استخدام الـ Interceptors لتمرير اللغة والـ Token ديناميكياً قبل إرسال أي طلب
api.interceptors.request.use(
    (config) => {
        // جلب لغة الموقع الحالية من i18next وتمريرها في الـ Header للباك إند
        const currentLang = i18n.language || 'en';
        config.headers['Accept-Language'] = currentLang;

        // 💡 إذا كان لديكِ نظام تسجيل دخول (Admin)، يمكنكِ تمرير الـ Token تلقائياً هنا مستقبلاً
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;