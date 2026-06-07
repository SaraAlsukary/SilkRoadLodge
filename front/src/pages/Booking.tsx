import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms';
import { useBooking } from '../hooks/useBooking';

interface BookingRange {
    check_in: string;
    check_out: string;
}

interface ApiRoom {
    id: number;
    slug: string;
    name: string;
    price: number;
    guests: number;
    existing_bookings?: BookingRange[]; // 🌟 مصفوفة التواريخ المحجوزة مسبقاً للغرفة
}

export default function BookingRoom() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const isRtl = currentLanguage === 'ar';

    const { data: rooms } = useRooms();
    const { createBooking, isLoading, error: serverError, success } = useBooking();

    const [searchParams] = useSearchParams();
    const roomIdFromUrl = searchParams.get('room') || '';

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        room_id: roomIdFromUrl,
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        gender: 'male',
        nationality: '',
        age: '',
        guests_count: '1',
        check_in: '',
        check_out: '',
        requested_services: [] as string[],
        notes: ''
    });

    useEffect(() => {
        if (roomIdFromUrl) {
            setFormData(prev => ({ ...prev, room_id: roomIdFromUrl }));
        }
    }, [roomIdFromUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = (service: string) => {
        setFormData(prev => {
            const services = prev.requested_services.includes(service)
                ? prev.requested_services.filter(s => s !== service)
                : [...prev.requested_services, service];
            return { ...prev, requested_services: services };
        });
    };

    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = t('err_name_req', 'الاسم الكامل مطلوب');
        } else if (formData.customer_name.trim().length < 3) {
            newErrors.customer_name = t('err_name_short', 'يجب أن يكون الاسم 3 أحرف على الأقل');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.customer_email) {
            newErrors.customer_email = t('err_email_req', 'البريد الإلكتروني مطلوب');
        } else if (!emailRegex.test(formData.customer_email)) {
            newErrors.customer_email = t('err_email_inv', 'صيغة البريد الإلكتروني غير صحيحة');
        }

        if (!formData.customer_phone) {
            newErrors.customer_phone = t('err_phone_req', 'رقم الهاتف مطلوب');
        } else if (formData.customer_phone.length < 7) {
            newErrors.customer_phone = t('err_phone_inv', 'رقم الهاتف غير صالح');
        }

        if (!formData.nationality.trim()) {
            newErrors.nationality = t('err_nat_req', 'الجنسية مطلوبة');
        }

        const ageNum = parseInt(formData.age);
        if (!formData.age || isNaN(ageNum)) {
            newErrors.age = t('err_age_req', 'العمر مطلوب');
        } else if (ageNum < 18) {
            newErrors.age = t('err_age_min', 'يجب أن يكون العمر 18 عاماً أو أكثر');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.room_id) {
            newErrors.room_id = t('err_room_req', 'يرجى اختيار الغرفة أولاً');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.check_in) {
            newErrors.check_in = t('err_checkin_req', 'تاريخ الدخول مطلوب');
        } else if (new Date(formData.check_in) < today) {
            newErrors.check_in = t('err_checkin_past', 'لا يمكن أن يكون تاريخ الدخول في الماضي');
        }

        if (!formData.check_out) {
            newErrors.check_out = t('err_checkout_req', 'تاريخ الخروج مطلوب');
        } else if (formData.check_in && new Date(formData.check_out) <= new Date(formData.check_in)) {
            newErrors.check_out = t('err_checkout_before', 'تاريخ الخروج يجب أن يكون بعد تاريخ الدخول');
        }

        const selectedRoom = rooms?.find((r: ApiRoom) => r.id === parseInt(formData.room_id));
        const guestsNum = parseInt(formData.guests_count);

        if (!formData.guests_count || isNaN(guestsNum) || guestsNum < 1) {
            newErrors.guests_count = t('err_guests_min', 'عدد الضيوف يجب أن يكون 1 على الأقل');
        } else if (selectedRoom && guestsNum > selectedRoom.guests) {
            newErrors.guests_count = t('err_guests_max', `هذه الغرفة تتسع لـ ${selectedRoom.guests} ضيوف كحد أقصى`);
        }

        // 🌟 فحص تعارض التواريخ مع الحجوزات السابقة للغرفة المحددة
        if (formData.check_in && formData.check_out && selectedRoom?.existing_bookings) {
            const userIn = new Date(formData.check_in);
            const userOut = new Date(formData.check_out);

            const isOverlapping = selectedRoom.existing_bookings.some((booking: BookingRange) => {
                const bookedIn = new Date(booking.check_in);
                const bookedOut = new Date(booking.check_out);
                // شرط التقاطع: تاريخ دخول المستخدم قبل خروج المحجوز، وتاريخ خروج المستخدم بعد دخول المحجوز
                return userIn < bookedOut && userOut > bookedIn;
            });

            if (isOverlapping) {
                newErrors.check_in = t('err_date_booked', 'الغرفة محجوزة بالفعل خلال هذه الفترة، يرجى اختيار تاريخ آخر');
                newErrors.check_out = t('err_date_booked', 'الغرفة محجوزة بالفعل خلال هذه الفترة، يرجى اختيار تاريخ آخر');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (validateStep1()) {
                setStep(2);
            }
            return;
        }

        if (!validateStep2()) return;

        try {
            await createBooking({
                ...formData,
                room_id: parseInt(formData.room_id),
                age: parseInt(formData.age),
                guests_count: parseInt(formData.guests_count)
            });
        } catch (err) {
            // التعامل مع الأخطاء عبر الـ Hook
        }
    };

    const availableServices = [
        { id: 'breakfast', label: t('service_breakfast', 'وجبة إفطار فاخرة') },
        { id: 'airport_pickup', label: t('service_pickup', 'توصيل من وإلى المطار') },
        { id: 'spa', label: t('service_spa', 'دخول حوض الاستجمام والسبا') },
    ];

    if (success) {
        return (
            <div className="min-h-screen bg-silk-cream flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-silk-sand/30 shadow-2xl text-center"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-silk-brown mb-3">{t('booking_success_title', 'تم الحجز بنجاح!')}</h2>
                    <p className="text-silk-dark/80 mb-6 font-medium">{t('booking_success_desc', 'سعداء باختياركم نزل طريق الحرير. تم تأكيد حجزكم وسنرسل التفاصيل عبر البريد الإلكتروني.')}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
                    >
                        {t('back_home', 'العودة للرئيسية')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <section className="min-h-screen py-16 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-3xl mx-auto">

                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-silk-brown mb-3 tracking-wide">
                        {t('book_your_stay', 'احجز إقامتك الاستثنائية')}
                    </h2>
                    <div className="w-20 h-1 bg-silk-sand mx-auto rounded-full mb-3"></div>
                    <p className="text-silk-brown/70 font-medium text-lg">
                        {t('booking_subtitle', 'اكتشف عبق التاريخ والفخامة في نزل طريق الحرير')}
                    </p>
                </div>

                <div className="flex items-center justify-center mb-8 gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step >= 1 ? 'bg-silk-brown text-silk-cream' : 'bg-silk-sand/30 text-silk-brown'}`}>1</div>
                    <div className={`w-16 h-0.5 rounded-full ${step === 2 ? 'bg-silk-brown' : 'bg-silk-sand/30'}`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step === 2 ? 'bg-silk-brown text-silk-cream' : 'bg-silk-sand/30 text-silk-brown'}`}>2</div>
                </div>

                

                <div className="bg-white/40 backdrop-blur-md border border-silk-sand/20 rounded-2xl p-6 md:p-10 shadow-xl">
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? -20 : 20 }} transition={{ duration: 0.3 }} className="space-y-5">
                                    <h3 className="text-xl font-bold text-silk-brown border-b border-silk-sand/30 pb-2 mb-4">{t('personal_info', 'البيانات الشخصية')}</h3>

                                    <div>
                                        <label className="block text-sm font-bold text-silk-brown mb-2">{t('full_name', 'الاسم الكامل')}</label>
                                        <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark ${errors.customer_name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="John Doe" />
                                        {errors.customer_name && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('phone_number', 'رقم الهاتف')}</label>
                                            <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-left dir-ltr ${errors.customer_phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="+963 9X XXX XXXX" />
                                            {errors.customer_phone && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('email_address', 'البريد الإلكتروني')}</label>
                                            <input type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-left dir-ltr ${errors.customer_email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="example@silkroad.com" />
                                            {errors.customer_email && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('gender', 'الجنس')}</label>
                                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-silk-sand/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all">
                                                <option value="male">{t('male', 'ذكر')}</option>
                                                <option value="female">{t('female', 'أنثى')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('nationality', 'الجنسية')}</label>
                                            <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all ${errors.nationality ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder={t('nationality_placeholder', 'Syrian')} />
                                            {errors.nationality && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.nationality}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('age', 'العمر')}</label>
                                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all ${errors.age ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="25" />
                                            {errors.age && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.age}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                                    <h3 className="text-xl font-bold text-silk-brown border-b border-silk-sand/30 pb-2 mb-4">{t('stay_details', 'تفاصيل الإقامة')}</h3>

                                    <div>
                                        {/* <label className="block text-sm font-bold text-silk-brown mb-2">{t('select_room', 'اختر نوع الغرفة')}</label>
                                        <select name="room_id" value={formData.room_id} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all ${errors.room_id ? 'border-rose-500' : 'border-silk-sand/40'}`}>
                                            <option value="">{t('choose_room_placeholder', '-- الرجاء اختيار غرفة --')}</option>
                                            {rooms?.map((room: ApiRoom) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.name} ({room.price}$ / {t('night', 'ليلة')})
                                                </option>
                                            ))}
                                        </select> */}
                                        {errors.room_id && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.room_id}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('check_in_date', 'تاريخ الدخول')}</label>
                                            <input type="date" name="check_in" value={formData.check_in} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all ${errors.check_in ? 'border-rose-500' : 'border-silk-sand/40'}`} />
                                            {errors.check_in && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.check_in}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('check_out_date', 'تاريخ الخروج')}</label>
                                            <input type="date" name="check_out" value={formData.check_out} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all ${errors.check_out ? 'border-rose-500' : 'border-silk-sand/40'}`} />
                                            {errors.check_out && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.check_out}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-silk-brown mb-2">{t('guests_count', 'عدد الضيوف')}</label>
                                            <input type="number" name="guests_count" value={formData.guests_count} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all ${errors.guests_count ? 'border-rose-500' : 'border-silk-sand/40'}`} />
                                            {errors.guests_count && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.guests_count}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-silk-brown mb-3">{t('extra_services', 'خدمات إضافية طلبتها')}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {availableServices.map(service => (
                                                <label key={service.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.requested_services.includes(service.id) ? 'border-silk-brown bg-silk-brown/10 font-bold' : 'border-silk-sand/30 bg-white/60 hover:bg-white/90'}`}>
                                                    <input type="checkbox" checked={formData.requested_services.includes(service.id)} onChange={() => handleCheckboxChange(service.id)} className="w-4 h-4 accent-silk-brown rounded" />
                                                    <span className="text-sm text-silk-dark">{service.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-silk-brown mb-2">{t('special_notes', 'ملاحظات خاصة (اختياري)')}</label>
                                        <textarea name="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-silk-sand/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark" placeholder={t('notes_placeholder', 'أي متطلبات خاصة بالسرير، التدخين، إلخ...')} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-between items-center gap-2 md:gap-0 pt-4 border-t border-silk-sand/20">
                            {step === 2 && (
                                <button type="button" onClick={() => setStep(1)} className={` ${i18n.language==='zh'||"ja"?"w-30":""} px-6 py-3 border ${i18n.language === 'en'||'fr'||'zh'||'es' ? " text-xs" : ""}  md:text-lg  border-silk-brown text-silk-brown font-bold rounded-xl hover:bg-silk-brown/5 transition-all duration-300 cursor-pointer`}>
                                    {t('back', 'السابق')}
                                </button>
                            )}
                            <button type="submit" disabled={isLoading} className={`py-3 px-8 bg-silk-brown hover:bg-silk-dark text-silk-cream 
                                font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer ${i18n.language === 'en'||'fr'||'zh'||'es' ? "text-xs" : ""}  md:text-lg  ${step === 1 ? 'w-full md:w-auto ms-auto' : 'w-full md:w-auto ms-auto flex items-center justify-center gap-2'}`}>
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-silk-cream border-t-transparent rounded-full animate-spin"></div>
                                ) : step === 1 ? (
                                    t('next', 'التالي')
                                ) : (
                                    t('confirm_booking', 'تأكيد الحجز الفندقي')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                {serverError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-red-300 border font-bold border-red-900 text-red-900 text-center rounded-xl font-medium">
                        {serverError}
                    </motion.div>
                )}
            </div>
        </section>
    );
}