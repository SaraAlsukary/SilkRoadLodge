import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    // 🌟 حالة جديدة لإظهار/إخفاء كلمة المرور
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { login, isLoggingIn, loginError } = useAuth();
    // hi
    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};
        let isValid = true;

        if (!email) {
            errors.email = 'البريد الإلكتروني مطلوب.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'يرجى إدخال بريد إلكتروني صالح.';
            isValid = false;
        }

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

        if (validateForm()) {
            login({ email, password });
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
    };

    // 🌟 شرط تعطيل الزر: جاري التحميل، أو الحقول فارغة، أو يوجد خطأ تحقق
    // const isButtonDisabled = isLoggingIn || !email || !password || !!validationErrors.email || !!validationErrors.password;

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
                        <div className="relative">
                            <input
                                // 🌟 تغيير نوع الحقل بناءً على الحالة
                                type={showPassword ? "text" : "password"}
                                dir='ltr'
                                value={password}
                                onChange={handlePasswordChange}
                                // 🌟 إضافة مسافة (pr-10) لعدم تداخل النص مع الأيقونة
                                className={`w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 bg-silk-cream/30 text-silk-dark transition-all duration-300
                                    ${validationErrors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-silk-sand focus:ring-silk-brown'}`}
                                placeholder="••••••••"
                            />

                            {/* 🌟 زر إظهار/إخفاء كلمة المرور */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-silk-brown transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    // أيقونة إخفاء (Eye Slash)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    // أيقونة إظهار (Eye)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {validationErrors.password}
                            </p>
                        )}
                    </div>

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
                        // 🌟 تفعيل التعطيل الذكي هنا
                        disabled={isLoggingIn}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-md
                            ${isLoggingIn
                                ? 'bg-silk-sand cursor-not-allowed opacity-70'
                                : 'bg-silk-brown hover:bg-silk-sand hover:shadow-lg active:scale-95 cursor-pointer'}`}
                    >
                        {isLoggingIn ? 'جاري التحقق...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}