import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms';
import { useBooking } from '../hooks/useBooking';
import { nationalitiesData } from '../utils/countries';
import { phoneCodesData } from '../utils/phoneCode';

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
    existing_bookings?: BookingRange[];
}

const LANGUAGE_PRIORITIES: Record<string, string[]> = {
    ar: ['sy', 'eg', 'sa', 'ae', 'jo', 'lb', 'ma', 'dz'],
    en: ['us', 'gb', 'ca', 'au'],
    fr: ['fr', 'be', 'ch', 'ma'],
    de: ['de', 'at', 'ch'],
    tr: ['tr'],
    ru: ['ru', 'ua', 'by', 'kz']
};

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

    // حالات القوائم المنسدلة المخصصة
    const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
    const [natDropdownOpen, setNatDropdownOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);

    const [phoneSearch, setPhoneSearch] = useState('');
    const [natSearch, setNatSearch] = useState('');

    const [formData, setFormData] = useState({
        room_id: roomIdFromUrl,
        customer_name: '',
        phone_code: '+963',
        phone_iso: 'sy',
        customer_phone: '',
        customer_email: '',
        gender: 'male',
        nationality: '',
        nationality_iso: '',
        nationality_label: '',
        age: '',
        guests_count: '1',
        check_in: '',
        check_out: '',
        requested_services: [] as string[],
        notes: ''
    });

    const selectedRoom = rooms?.find((r: ApiRoom) => r.id === parseInt(formData.room_id));

    useEffect(() => {
        if (roomIdFromUrl) {
            setFormData(prev => ({ ...prev, room_id: roomIdFromUrl }));
        }
    }, [roomIdFromUrl]);

    // تحديث رمز الهاتف الافتراضي تلقائياً بناءً على لغة الموقع الحالية
    useEffect(() => {
        const priorities = LANGUAGE_PRIORITIES[currentLanguage] || [];

        if (priorities.length > 0 && !formData.customer_phone) {
            const firstPriorityIso = priorities[0];
            const defaultCountryPhone = phoneCodesData.find(
                pc => pc.iso.toLowerCase() === firstPriorityIso.toLowerCase()
            );

            if (defaultCountryPhone) {
                setFormData(prev => ({
                    ...prev,
                    phone_code: defaultCountryPhone.code,
                    phone_iso: defaultCountryPhone.iso.toLowerCase()
                }));
            }
        }
    }, [currentLanguage]);

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

        const guestsNum = parseInt(formData.guests_count);

        if (!formData.guests_count || isNaN(guestsNum) || guestsNum < 1) {
            newErrors.guests_count = t('err_guests_min', 'عدد الضيوف يجب أن يكون 1 على الأقل');
        } else if (selectedRoom && guestsNum > selectedRoom.guests) {
            newErrors.guests_count = t('err_guests_max', `هذه الغرفة تتسع لـ ${selectedRoom.guests} ضيوف كحد أقصى`);
        }

        if (formData.check_in && formData.check_out && selectedRoom?.existing_bookings) {
            const userIn = new Date(formData.check_in);
            const userOut = new Date(formData.check_out);

            const isOverlapping = selectedRoom.existing_bookings.some((booking: BookingRange) => {
                const bookedIn = new Date(booking.check_in);
                const bookedOut = new Date(booking.check_out);
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
                customer_phone: `${formData.phone_code} ${formData.customer_phone}`,
                room_id: parseInt(formData.room_id),
                age: parseInt(formData.age),
                guests_count: parseInt(formData.guests_count)
            });
        } catch (err) {
            // التعامل مع أخطاء السيرفر
        }
    };

    const availableServices = [
        { id: 'bedouin_tent', label: t('bedouin_tent_title') },
        { id: 'safari_tour_title', label: t('safari_tour_title') },
        { id: 'bicycles_title', label: t('bicycles_title') },
        { id: 'airport_pickup_title', label: t('airport_pickup_title') },
        { id: 'syria_tour_title', label: t('syria_tour_title') },
        { id: 'breakfast', label: t('service_breakfast', 'وجبة إفطار') },
        { id: 'lunch', label: t('service_lunch', 'وجبة غداء') },
        { id: 'dinner', label: t('service_dinner', 'وجبة عشاء') },
    ];

    const currentNationalities = nationalitiesData[currentLanguage] || nationalitiesData['en'] || [];

    const getCountryNameByIso = (iso: string): string => {
        const found = currentNationalities.find((n: any) => n.iso?.toLowerCase() === iso?.toLowerCase());
        return found ? found.label : '';
    };

    const processedPhoneCodes = React.useMemo(() => {
        const priorities = LANGUAGE_PRIORITIES[currentLanguage] || [];
        const filtered = phoneCodesData.filter(pc => {
            const countryName = getCountryNameByIso(pc.iso).toLowerCase();
            const search = phoneSearch.toLowerCase();
            return (
                pc.code.includes(search) ||
                pc.iso.toLowerCase().includes(search) ||
                countryName.includes(search)
            );
        });

        return [...filtered].sort((a, b) => {
            const indexA = priorities.indexOf(a.iso.toLowerCase());
            const indexB = priorities.indexOf(b.iso.toLowerCase());

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        });
    }, [phoneSearch, currentLanguage, currentNationalities]);

    const processedNationalities = React.useMemo(() => {
        const priorities = LANGUAGE_PRIORITIES[currentLanguage] || [];
        const filtered = currentNationalities.filter((nat: any) =>
            nat.label.toLowerCase().includes(natSearch.toLowerCase()) ||
            nat.iso?.toLowerCase().includes(natSearch.toLowerCase())
        );

        return [...filtered].sort((a: any, b: any) => {
            const indexA = priorities.indexOf(a.iso?.toLowerCase());
            const indexB = priorities.indexOf(b.iso?.toLowerCase());

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        });
    }, [natSearch, currentLanguage, currentNationalities]);

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
                    <button onClick={() => window.location.href = '/'} className="w-full py-3 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
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
                    <h2 className="text-4xl md:text-5xl font-bold text-silk-brown mb-3 tracking-wide">{t('book_your_stay', 'احجز إقامتك الاستثنائية')}</h2>
                    <div className="w-20 h-1 bg-silk-sand mx-auto rounded-full mb-3"></div>
                    <p className="text-silk-brown/70 font-medium text-lg">{t('booking_subtitle', 'اكتشف عبق التاريخ والفخامة في نزل طريق الحرير')}</p>
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
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('phone_number', 'رقم الهاتف')}</label>
                                            <div dir='rtl' className={`flex flex-row-reverse md:flex-row-reverse rounded-xl border bg-white/80 focus-within:ring-2 focus-within:ring-silk-brown/50 transition-all relative ${errors.customer_phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>

                                                <div className="relative w-32">
                                                    <div
                                                        onClick={() => {
                                                            setPhoneDropdownOpen(!phoneDropdownOpen);
                                                            setPhoneSearch('');
                                                        }}
                                                        className="flex items-center justify-between gap-1 px-3 py-3 h-full cursor-pointer hover:bg-silk-sand/10 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <img src={`https://flagcdn.com/w20/${formData.phone_iso}.png`} alt="flag" className="w-5 shadow-sm" />
                                                            <span dir='ltr' className="font-bold font-arabic text-silk-dark text-sm">{formData.phone_code}</span>
                                                        </div>
                                                        <svg className="w-3 h-3 text-silk-dark/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>

                                                    {phoneDropdownOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setPhoneDropdownOpen(false)}></div>
                                                            <div className="absolute top-full left-0 mt-2 w-56 max-h-64 overflow-hidden bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col">
                                                                <div className="p-2 border-b border-silk-sand/20 bg-silk-cream/30 sticky top-0 z-10">
                                                                    <input
                                                                        type="text"
                                                                        value={phoneSearch}
                                                                        onChange={(e) => setPhoneSearch(e.target.value)}
                                                                        placeholder={t('search_placeholder', 'بحث...')}
                                                                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-silk-sand/30 bg-white focus:outline-none focus:ring-1 focus:ring-silk-brown text-right"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </div>

                                                                <ul className="overflow-y-auto flex-1 max-h-48">
                                                                    {processedPhoneCodes.length > 0 ? (
                                                                        processedPhoneCodes.map((pc, idx) => (
                                                                            <li
                                                                                key={idx}
                                                                                onClick={() => {
                                                                                    setFormData(prev => ({ ...prev, phone_code: pc.code, phone_iso: pc.iso }));
                                                                                    setPhoneDropdownOpen(false);
                                                                                }}
                                                                                className="flex items-center justify-between px-4 py-2 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/5 last:border-0"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <img src={`https://flagcdn.com/w20/${pc.iso}.png`} alt="" className="w-5 shadow-sm" />
                                                                                    <span dir='ltr' className="font-arabic font-medium text-sm text-silk-dark">{pc.code}</span>
                                                                                </div>
                                                                                <span className="text-xxs text-silk-brown/60 max-w-[100px] truncate">
                                                                                    {getCountryNameByIso(pc.iso)}
                                                                                </span>
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li className="px-4 py-3 text-xs text-center text-silk-dark/40">{t('no_results', 'لا توجد نتائج')}</li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="w-px bg-silk-sand/40 my-2"></div>
                                                <input
                                                    type="tel"
                                                    name="customer_phone"
                                                    value={formData.customer_phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-3 font-arabic bg-transparent focus:outline-none font-medium text-left"
                                                    placeholder="9X XXX XXXX"
                                                />
                                            </div>
                                            {errors.customer_phone && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_phone}</p>}
                                        </div>
                                        <div>
                                            <label className={`block text-md font-bold text-silk-brown mb-2`}>{t('email_address', 'البريد الإلكتروني')}</label>
                                            <input type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} dir='ltr' className={` w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-left dir-ltr ${errors.customer_email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="example@silkroadlodge.com" />
                                            {errors.customer_email && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('gender', 'الجنس')}</label>
                                            <div
                                                onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50`}
                                            >
                                                <span className="font-bold text-silk-dark">
                                                    {formData.gender === 'male' ? t('male', 'ذكر') : t('female', 'أنثى')}
                                                </span>
                                                <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${genderDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>

                                            {genderDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setGenderDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col overflow-hidden">
                                                        <ul className="flex-1">
                                                            <li
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, gender: 'male' }));
                                                                    setGenderDropdownOpen(false);
                                                                }}
                                                                className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/10 font-bold text-md ${formData.gender === 'male' ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}
                                                            >
                                                                {t('male', 'ذكر')}
                                                            </li>
                                                            <li
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, gender: 'female' }));
                                                                    setGenderDropdownOpen(false);
                                                                }}
                                                                className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors font-bold text-md ${formData.gender === 'female' ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}
                                                            >
                                                                {t('female', 'أنثى')}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('nationality', 'الجنسية')}</label>
                                            <div
                                                onClick={() => {
                                                    setNatDropdownOpen(!natDropdownOpen);
                                                    setNatSearch('');
                                                }}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all ${errors.nationality ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50'}`}
                                            >
                                                {formData.nationality ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={`https://flagcdn.com/w20/${formData.nationality_iso}.png`} alt="flag" className="w-5 shadow-sm" />
                                                        <span className="font-bold text-silk-dark">{formData.nationality_label}</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-silk-dark/60">{t('nationality', 'اختر')}</span>
                                                )}
                                                <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${natDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>

                                            {natDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setNatDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-hidden bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col">
                                                        <div className="p-2 border-b border-silk-sand/20 bg-silk-cream/30 sticky top-0 z-10">
                                                            <input
                                                                type="text"
                                                                value={natSearch}
                                                                onChange={(e) => setNatSearch(e.target.value)}
                                                                placeholder={t('search_placeholder', 'بحث...')}
                                                                className="w-full px-3 py-2 text-sm rounded-lg border border-silk-sand/30 bg-white focus:outline-none focus:ring-1 focus:ring-silk-brown text-right"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>

                                                        <ul className="overflow-y-auto flex-1 max-h-52">
                                                            {processedNationalities.length > 0 ? (
                                                                processedNationalities.map((nat: any) => (
                                                                    <li
                                                                        key={nat.value}
                                                                        onClick={() => {
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                nationality: nat.value,
                                                                                nationality_iso: nat.iso?.toLowerCase(),
                                                                                nationality_label: nat.label
                                                                            }));
                                                                            setNatDropdownOpen(false);
                                                                        }}
                                                                        className="flex items-center gap-3 px-4 py-2 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/5 last:border-0 font-bold text-md text-silk-dark"
                                                                    >
                                                                        <img src={`https://flagcdn.com/w20/${nat.iso?.toLowerCase()}.png`} alt="" className="w-5 shadow-sm" />
                                                                        <span>{nat.label}</span>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="px-4 py-3 text-xs text-center text-silk-dark/40">{t('no_results', 'لا توجد نتائج')}</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                       <div className="relative">
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('age', 'العمر')}</label>
                                            <div
                                                onClick={() => setAgeDropdownOpen(!ageDropdownOpen)}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all ${errors.age ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50'}`}
                                            >
                                                <span className={`font-bold ${formData.age ? 'text-silk-dark' : 'text-silk-dark/60'}`}>
                                                    {formData.age ? formData.age : t('age_select', 'اختر')}
                                                </span>
                                                <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${ageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>

                                            {ageDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setAgeDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-hidden bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col">
                                                        <ul className="overflow-y-auto flex-1 max-h-52">
                                                            {Array.from({ length: 83 }, (_, i) => i + 18).map((num) => (
                                                                <li
                                                                    key={num}
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, age: num.toString() }));
                                                                        setErrors(prev => ({ ...prev, age: '' }));
                                                                        setAgeDropdownOpen(false);
                                                                    }}
                                                                    className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/10 last:border-0 font-bold text-md text-center ${formData.age === num.toString() ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}
                                                                >
                                                                    {num}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                            {errors.age && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.age}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-silk-sand/20 flex justify-end">
                                        <button type="submit" className="px-8 py-3.5 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
                                           { t('next', 'التالي')}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                                    {/* <h3 className="text-xl font-bold text-silk-brown border-b border-silk-sand/30 pb-2 mb-4">{t('booking_details', 'تفاصيل الحجز')}</h3> */}

                                    <div>
                                       
                                        {selectedRoom?.existing_bookings && selectedRoom.existing_bookings.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                                            >
                                                <p className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                {t('reserved_dates_title', 'التواريخ غير المتاحة لهذه الغرفة:')}

                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedRoom.existing_bookings.map((booking:BookingRange, idx:number) => (
                                                        <span key={idx} className="px-3 py-1 bg-white/80 text-xs font-bold rounded-lg border border-amber-500/20 text-silk-dark shadow-sm">
                                                            {booking.check_in} {t('to', 'إلى')} {booking.check_out}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('check_in_date', 'تاريخ الدخول')}</label>
                                            <input type="date" name="check_in" value={formData.check_in} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.check_in ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                                            {errors.check_in && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.check_in}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('check_out_date', 'تاريخ الخروج')}</label>
                                            <input type="date" name="check_out" value={formData.check_out} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.check_out ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                                            {errors.check_out && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.check_out}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('guests_count', 'عدد الضيوف')}</label>
                                            <input type="number" name="guests_count" value={formData.guests_count} onChange={handleInputChange} min="1" className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.guests_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="1" />
                                            {errors.guests_count && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.guests_count}</p>}
                                        </div>
                                    </div>

                                    {/* 🌟 تم الإرجاع للشكل الأصلي البسيط المنسق بدون خلفيات أو برواز إضافي غريب */}

                                    <div>
                                        <label className="block text-md font-bold text-silk-brown mb-3">{t('extra_services', 'خدمات إضافية طلبتها')}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {availableServices.map(service => (
                                                <label key={service.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.requested_services.includes(service.id) ? 'border-silk-brown bg-silk-brown/10 font-bold' : 'border-silk-sand/30 bg-white/60 hover:bg-white/90'}`}>
                                                    <input type="checkbox" checked={formData.requested_services.includes(service.id)} onChange={() => handleCheckboxChange(service.id)} className="w-4 h-4 accent-silk-brown rounded" />
                                                    <span className="text-md text-silk-dark">{service.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-md font-bold text-silk-brown mb-2">{t('special_notes', 'ملاحظات خاصة')}</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-silk-sand/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark resize-none" placeholder={t('notes_placeholder', 'هل لديك أي متطلبات خاصة أو أوقات وصول مفضلة؟')} />
                                    </div>

                                    {serverError && (
                                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-sm font-bold">
                                            {serverError}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-silk-sand/20 flex justify-between items-center gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 border border-silk-sand text-silk-brown hover:bg-silk-sand/10 font-bold rounded-xl transition-all duration-300 cursor-pointer">
                                            {t('back', 'السابق')}
                                        </button>
                                        <button type="submit" disabled={isLoading} className="flex-1 max-w-xs py-3.5 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
                                            {isLoading ? t('booking_loading', 'جاري إرسال حجزك...') : t('confirm_booking', 'تأكيد الحجز النهائي')}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </section>
    );
}