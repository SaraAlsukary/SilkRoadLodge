import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // 🌟 حالة جديدة لتخزين أخطاء التحقق المحلية
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    const { login, isLoggingIn, loginError } = useAuth();

    // 🌟 دالة التحقق من الحقول
    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};
        let isValid = true;

        // فحص البريد الإلكتروني
        if (!email) {
            errors.email = 'البريد الإلكتروني مطلوب.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'يرجى إدخال بريد إلكتروني صالح.';
            isValid = false;
        }

        // فحص كلمة المرور
        if (!password) {
            errors.password = 'كلمة المرور مطلوبة.';
            isValid = false;
        } else if (password.length < 6) {
            errors.password = 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // إذا كانت الحقول صالحة، قم بتسجيل الدخول
        if (validateForm()) {
            login({ email, password });
        }
    };

    // دالة مساعدة لتنظيف الخطأ عند بدء الكتابة
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
    };

    return (
        <div className="min-h-screen bg-silk-cream flex items-center justify-center p-4 font-arabic" dir="rtl">
            <div className="bg-white rounded-2xl shadow-xl border border-silk-sand w-full max-w-md p-8 overflow-hidden relative">

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-silk-brown via-silk-sand to-silk-brown"></div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-silk-dark mb-2">فندق طريق الحرير</h1>
                    <p className="text-silk-brown text-lg">بوابة دخول الإدارة</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* حقل البريد الإلكتروني */}
                    <div>
                        <label className="block text-silk-dark font-semibold mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            dir='ltr'
                            value={email}
                            onChange={handleEmailChange}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 bg-silk-cream/30 text-silk-dark transition-all duration-300
                                ${validationErrors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-silk-sand focus:ring-silk-brown'}`}
                            placeholder="admin@silkroad.com"
                        />
                        {/* رسالة خطأ البريد الإلكتروني */}
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {validationErrors.email}
                            </p>
                        )}
                    </div>

                    {/* حقل كلمة المرور */}
                    <div>
                        <label className="block text-silk-dark font-semibold mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            dir='ltr'
                            value={password}
                            onChange={handlePasswordChange}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 bg-silk-cream/30 text-silk-dark transition-all duration-300
                                ${validationErrors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-silk-sand focus:ring-silk-brown'}`}
                            placeholder="••••••••"
                        />
                        {/* رسالة خطأ كلمة المرور */}
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {validationErrors.password}
                            </p>
                        )}
                    </div>

                    {/* خطأ السيرفر (إن وجد) */}
                    {loginError && (
                        <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200 flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{loginError.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className={`w-full py-3 ${!isLoggingIn ? "cursor-pointer" : ""} rounded-lg font-bold text-white transition-all duration-300 shadow-md
                            ${isLoggingIn
                                ? 'bg-silk-sand cursor-not-allowed'
                                : 'bg-silk-brown hover:bg-silk-sand hover:shadow-lg active:scale-95'}`}
                    >
                        {isLoggingIn ? 'جاري التحقق...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}