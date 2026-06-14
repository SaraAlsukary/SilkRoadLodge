import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
// import { useSearchParams } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { nationalitiesData } from '../utils/countries';
import { phoneCodesData } from '../utils/phoneCode';
import { LANGUAGE_PRIORITIES } from '../utils/languages';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

// 1. تعريف أنواع الغرف الكلاسيكية بناءً على ترجماتك واستهلاكها من الموارد
interface RoomType {
    id: string;
    nameKey: string;
    guests: number;
    doubles: number;
    singles: number;
}

const ROOM_TYPES: RoomType[] = [
    { id: 'single', nameKey: 'single_room_name', guests: 1, doubles: 0, singles: 1 },
    { id: 'double', nameKey: 'double_room_name', guests: 2, doubles: 1, singles: 0 },
    { id: 'twin', nameKey: 'twin_room_name', guests: 2, doubles: 0, singles: 2 },
    { id: 'triple', nameKey: 'triple_room_name', guests: 3, doubles: 0, singles: 3 },
    { id: 'quad', nameKey: 'quad_room_name', guests: 4, doubles: 0, singles: 4 }
];

// 2. الخوارزمية الذهبية: البحث عن التجميعات الممكنة بناءً على الموارد والقاعدة الذهبية
const findRoomConfigurations = (
    reqRooms: number,
    reqGuests: number,
    availDoubles: number,
    availSingles: number
): RoomType[][] => {
    const results: RoomType[][] = [];
    const seen = new Set<string>();

    const backtrack = (
        startIdx: number,
        currentCombo: RoomType[],
        currentGuests: number,
        currentDoubles: number,
        currentSingles: number
    ) => {
        // إذا وصلنا لعدد الغرف المطلوب
        if (currentCombo.length === reqRooms) {

            // 🌟 القاعدة الذهبية: السعة الإجمالية >= عدد الأشخاص
            // (لا يوجد حد أعلى! شخص واحد يمكنه حجز 4 غرف رباعية إذا أراد)
            if (currentGuests >= reqGuests) {
                const signature = currentCombo.map(r => r.id).sort().join('|');
                if (!seen.has(signature)) {
                    seen.add(signature);
                    results.push([...currentCombo]);
                }
            }
            return;
        }

        for (let i = startIdx; i < ROOM_TYPES.length; i++) {
            const room = ROOM_TYPES[i];

            // التحقق من أن الفندق يمتلك أسرة كافية لهذا النوع من الغرف حالياً
            if (currentDoubles + room.doubles <= availDoubles &&
                currentSingles + room.singles <= availSingles) {

                currentCombo.push(room);
                backtrack(i, currentCombo, currentGuests + room.guests, currentDoubles + room.doubles, currentSingles + room.singles);
                currentCombo.pop();
            }
        }
    };

    backtrack(0, [], 0, 0, 0);

    // الترتيب: نعرض الخيار الأقرب منطقياً للسعة المطلوبة في الأعلى (لكن نظهر جميع الخيارات الأخرى تحتها)
    return results.sort((a, b) => {
        const capA = a.reduce((sum, r) => sum + r.guests, 0);
        const capB = b.reduce((sum, r) => sum + r.guests, 0);
        return capA - capB;
    });
};

// 3. تنسيق أسماء التجميعة مع استدعاء دالة الترجمة t()
const formatComboName = (combo: RoomType[], t: any) => {
    const counts: Record<string, number> = {};
    combo.forEach(room => {
        const translatedName = t(room.nameKey);
        counts[translatedName] = (counts[translatedName] || 0) + 1;
    });
    return Object.entries(counts)
        .map(([name, count]) => `<span class="font-bold text-silk-brown">${count} ×</span> ${name}`)
        .join(' <span class="text-silk-sand mx-1">+</span> ');
};

export default function BookingRoom() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const isRtl = currentLanguage === 'ar';

    const { createBooking, isLoading, error: serverError, success } = useBooking();
    // const [searchParams] = useSearchParams();

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // الموارد الافتراضية للفندق
    const [availableResources, setAvailableResources] = useState({ rooms: 8, doubles: 8, singles: 10 });
    const [isCheckingResources, setIsCheckingResources] = useState(false);

    const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
    const [natDropdownOpen, setNatDropdownOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
    const [phoneSearch, setPhoneSearch] = useState('');
    const [natSearch, setNatSearch] = useState('');

    const [formData, setFormData] = useState({
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
        rooms_count: '1',
        check_in: '',
        check_out: '',
        requested_services: [] as string[],
        notes: ''
    });

    const [selectedCombo, setSelectedCombo] = useState<RoomType[] | null>(null);

    // التحقق من الموارد من السيرفر عند تحديد التاريخ
    useEffect(() => {
        const fetchResources = async () => {
            if (formData.check_in && formData.check_out && new Date(formData.check_out) > new Date(formData.check_in)) {
                setIsCheckingResources(true);
                try {
                    const res = await fetch(`https://silkroadlodge.com/api/check-resources?check_in=${formData.check_in}&check_out=${formData.check_out}`);
                    // const res = await fetch(`http://127.0.0.1:8000/api/check-resources?check_in=${formData.check_in}&check_out=${formData.check_out}`);

                    // تأكد من صحة مسار الـ API الخاص بك هنا
                    // const res = await fetch(`http://localhost:8000/api/check-resources?check_in=${formData.check_in}&check_out=${formData.check_out}`);
                    if (res.ok) {
                        const data = await res.json();
                        console.log(data)
                        setAvailableResources({
                            rooms: data.available_rooms,
                            doubles: data.available_doubles,
                            singles: data.available_singles
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch resources", err);
                } finally {
                    setIsCheckingResources(false);
                }
            }
        };
        fetchResources();
    }, [formData.check_in, formData.check_out]);

    useEffect(() => {
        const priorities = LANGUAGE_PRIORITIES[currentLanguage] || [];
        if (priorities.length > 0 && !formData.customer_phone) {
            const firstPriorityIso = priorities[0];
            const defaultCountryPhone = phoneCodesData.find(pc => pc.iso.toLowerCase() === firstPriorityIso.toLowerCase());
            if (defaultCountryPhone) {
                setFormData(prev => ({ ...prev, phone_code: defaultCountryPhone.code, phone_iso: defaultCountryPhone.iso.toLowerCase() }));
            }
        }
    }, [currentLanguage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (['check_in', 'check_out', 'guests_count', 'rooms_count'].includes(name)) setSelectedCombo(null);
    };

    const handleCheckboxChange = (service: string) => {
        setFormData(prev => ({
            ...prev,
            requested_services: prev.requested_services.includes(service)
                ? prev.requested_services.filter(s => s !== service)
                : [...prev.requested_services, service]
        }));
    };

    // توليد التجميعات المتاحة
    // const availableCombinations = useMemo(() => {
    //     if (!formData.check_in || !formData.check_out || !formData.guests_count || !formData.rooms_count) return [];
    //     const reqRooms = parseInt(formData.rooms_count);
    //     const reqGuests = parseInt(formData.guests_count);
    //     if (reqRooms > availableResources.rooms) return [];

    //     return findRoomConfigurations(reqRooms, reqGuests, availableResources.doubles, availableResources.singles);
    // }, [availableResources, formData.check_in, formData.check_out, formData.guests_count, formData.rooms_count]);
    const availableCombinations = useMemo(() => {
        if (!formData.check_in || !formData.check_out || !formData.guests_count || !formData.rooms_count) return [];
        const reqRooms = parseInt(formData.rooms_count);
        const reqGuests = parseInt(formData.guests_count);
        if (reqRooms > availableResources.rooms) return [];

        // جلب كل الخيارات الممكنة
        const allCombos = findRoomConfigurations(reqRooms, reqGuests, availableResources.doubles, availableResources.singles);

        // 🌟 نأخذ أفضل 3 خيارات فقط (الأقرب لعدد الأشخاص المطلوب ثم مساحات أكبر للرفاهية)
        return allCombos.slice(0, 3);
    }, [availableResources, formData.check_in, formData.check_out, formData.guests_count, formData.rooms_count]);
    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.customer_name.trim()) newErrors.customer_name = t('err_name_req');
        else if (formData.customer_name.trim().length < 3) newErrors.customer_name = t('err_name_short');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.customer_email) newErrors.customer_email = t('err_email_req');
        else if (!emailRegex.test(formData.customer_email)) newErrors.customer_email = t('err_email_inv');

        // if (!formData.customer_phone) newErrors.customer_phone = t('err_phone_req');
        // else if (formData.customer_phone.length < 7) newErrors.customer_phone = t('err_phone_inv');
        if (!formData.customer_phone) {
            newErrors.customer_phone = t('err_phone_req');
        } else {
            // نمرر الرقم ورمز الدولة (يجب أن يكون بأحرف كبيرة uppercase)
            const isValid = isValidPhoneNumber(
                formData.customer_phone,
                formData.phone_iso.toUpperCase() as CountryCode
            );

            if (!isValid) {
                newErrors.customer_phone = t('err_phone_inv', 'رقم الهاتف غير صالح لهذه الدولة');
            }
        }
        if (!formData.nationality.trim()) newErrors.nationality = t('err_nat_req');

        const ageNum = parseInt(formData.age);
        if (!formData.age || isNaN(ageNum)) newErrors.age = t('err_age_req');
        // else if (ageNum < 18) newErrors.age = t('err_age_min');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.check_in) newErrors.check_in = t('err_checkin_req');
        else if (new Date(formData.check_in) < today) newErrors.check_in = t('err_checkin_past');

        if (!formData.check_out) newErrors.check_out = t('err_checkout_req');
        else if (formData.check_in && new Date(formData.check_out) <= new Date(formData.check_in)) newErrors.check_out = t('err_checkout_before');

        if (!formData.guests_count || parseInt(formData.guests_count) < 1) newErrors.guests_count = t('err_guests_min');
        if (!formData.rooms_count || parseInt(formData.rooms_count) < 1) newErrors.rooms_count = t('err_rooms_min');

        if (parseInt(formData.rooms_count) > availableResources.rooms) {
            newErrors.rooms_count = `عذراً، المتاح حالياً هو ${availableResources.rooms} غرف فقط`;
        }

        if (!selectedCombo) newErrors.combination = t('err_select_combo');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) { if (validateStep1()) setStep(2); return; }
        if (!validateStep2() || !selectedCombo) return;

        const totalDoubles = selectedCombo.reduce((sum, r) => sum + r.doubles, 0);
        const totalSingles = selectedCombo.reduce((sum, r) => sum + r.singles, 0);

        // تجهيز الاسم النصي للإيميل باستخدام لغة العميل الحالية
        const counts: Record<string, number> = {};
        selectedCombo.forEach(room => {
            const translatedName = t(room.nameKey);
            counts[translatedName] = (counts[translatedName] || 0) + 1;
        });
        const bookedRoomNames = Object.entries(counts).map(([name, count]) => `${count} × ${name}`).join(' + ');

        try {
            // يتم إرسال هذا الـ Payload إلى السيرفر ليقوم بربط الحجز بغرف عشوائية كأوعية، وحفظ تفاصيل الأسرة.
            await createBooking({
                ...formData,
                customer_phone: `${formData.phone_code} ${formData.customer_phone}`,
                age: parseInt(formData.age),
                guests_count: parseInt(formData.guests_count),
                rooms_count: parseInt(formData.rooms_count),
                double_beds_count: totalDoubles,
                single_beds_count: totalSingles,
                booked_room_names: bookedRoomNames
            });
        } catch (err) { }
    };

    const availableServices = [
        { id: 'bedouin_tent_title', label: t('bedouin_tent_title') },
        { id: 'safari_tour_title', label: t('safari_tour_title') },
        { id: 'bicycles_title', label: t('bicycles_title') },
        { id: 'airport_pickup_title', label: t('airport_pickup_title') },
        { id: 'syria_tour_title', label: t('syria_tour_title') },
        { id: 'breakfast', label: t('service_breakfast') },
        { id: 'lunch', label: t('service_lunch') },
        { id: 'dinner', label: t('service_dinner') },
    ];

    const currentNationalities = nationalitiesData[currentLanguage] || nationalitiesData['en'] || [];
    const getCountryNameByIso = (iso: string) => currentNationalities.find((n: any) => n.iso?.toLowerCase() === iso?.toLowerCase())?.label || '';

    const processedPhoneCodes = React.useMemo(() => {
        const search = phoneSearch.toLowerCase();
        return phoneCodesData.filter(pc => pc.code.includes(search) || pc.iso.toLowerCase().includes(search) || getCountryNameByIso(pc.iso).toLowerCase().includes(search));
    }, [phoneSearch, currentLanguage]);

    const processedNationalities = React.useMemo(() => {
        const search = natSearch.toLowerCase();
        return currentNationalities.filter((nat: any) => nat.label.toLowerCase().includes(search) || nat.iso?.toLowerCase().includes(search));
    }, [natSearch, currentLanguage]);

    if (success) {
        return (
            <div className="min-h-screen bg-silk-cream flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-silk-sand/30 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-silk-brown mb-3">{t('booking_success_title')}</h2>
                    <p className="text-silk-dark/80 mb-6 font-medium">{t('booking_success_desc')}</p>
                    <button onClick={() => window.location.href = '/'} className="w-full py-3 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">{t('back_home')}</button>
                </motion.div>
            </div>
        );
    }

    return (
        <section className="min-h-screen py-16 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-silk-brown mb-3 tracking-wide">{t('book_your_stay')}</h2>
                    <div className="w-20 h-1 bg-silk-sand mx-auto rounded-full mb-3"></div>
                    <p className="text-silk-brown/70 font-medium text-lg">{t('booking_subtitle')}</p>
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
                                    <h3 className="text-xl font-bold text-silk-brown border-b border-silk-sand/30 pb-2 mb-4">{t('personal_info')}</h3>

                                    <div>
                                        <label className="block text-sm font-bold text-silk-brown mb-2">{t('full_name')}</label>
                                        <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark ${errors.customer_name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="John Doe" />
                                        {errors.customer_name && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_name}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('phone_number')}</label>
                                            <div dir='rtl' className={`flex flex-row-reverse md:flex-row-reverse rounded-xl border bg-white/80 focus-within:ring-2 focus-within:ring-silk-brown/50 transition-all relative ${errors.customer_phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>
                                                <div className="relative w-32">
                                                    <div onClick={() => { setPhoneDropdownOpen(!phoneDropdownOpen); setPhoneSearch(''); }} className="flex items-center justify-between gap-1 px-3 py-3 h-full cursor-pointer hover:bg-silk-sand/10 transition-colors">
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
                                                                    <input type="text" value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} placeholder={t('search_placeholder')} className="w-full px-3 py-1.5 text-xs rounded-lg border border-silk-sand/30 bg-white focus:outline-none focus:ring-1 focus:ring-silk-brown text-right" onClick={(e) => e.stopPropagation()} />
                                                                </div>
                                                                <ul className="overflow-y-auto flex-1 max-h-48">
                                                                    {processedPhoneCodes.map((pc, idx) => (
                                                                        <li key={idx} onClick={() => { setFormData(prev => ({ ...prev, phone_code: pc.code, phone_iso: pc.iso })); setPhoneDropdownOpen(false); }} className="flex items-center justify-between px-4 py-2 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/5 last:border-0">
                                                                            <div className="flex items-center gap-3">
                                                                                <img src={`https://flagcdn.com/w20/${pc.iso}.png`} alt="" className="w-5 shadow-sm" />
                                                                                <span dir='ltr' className="font-arabic font-medium text-sm text-silk-dark">{pc.code}</span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="w-px bg-silk-sand/40 my-2"></div>
                                                <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} className="w-full px-3 py-3 font-arabic bg-transparent focus:outline-none font-medium text-left" placeholder="9X XXX XXXX" />
                                            </div>
                                            {errors.customer_phone && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('email_address')}</label>
                                            <input type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} dir='ltr' className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-left dir-ltr ${errors.customer_email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="example@email.com" />
                                            {errors.customer_email && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.customer_email}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('gender')}</label>
                                            <div onClick={() => setGenderDropdownOpen(!genderDropdownOpen)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50`}>
                                                <span className="font-bold text-silk-dark">{t(formData.gender)}</span>
                                                <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${genderDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                            {genderDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setGenderDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col overflow-hidden">
                                                        <ul className="flex-1">
                                                            {['male', 'female', 'other'].map(g => (
                                                                <li key={g} onClick={() => { setFormData(prev => ({ ...prev, gender: g })); setGenderDropdownOpen(false); }} className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/10 font-bold text-md ${formData.gender === g ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}>{t(g)}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('nationality')}</label>
                                            <div onClick={() => { setNatDropdownOpen(!natDropdownOpen); setNatSearch(''); }} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all ${errors.nationality ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50'}`}>
                                                {formData.nationality ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={`https://flagcdn.com/w20/${formData.nationality_iso}.png`} alt="flag" className="w-5 shadow-sm" />
                                                        <span className="font-bold text-silk-dark">{formData.nationality_label}</span>
                                                    </div>
                                                ) : (<span className="font-bold text-silk-dark/60">{t('nationality')}</span>)}
                                                <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${natDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                            {natDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setNatDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-hidden bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col">
                                                        <div className="p-2 border-b border-silk-sand/20 bg-silk-cream/30 sticky top-0 z-10">
                                                            <input type="text" value={natSearch} onChange={(e) => setNatSearch(e.target.value)} placeholder={t('search_placeholder')} className="w-full px-3 py-2 text-sm rounded-lg border border-silk-sand/30 bg-white focus:outline-none focus:ring-1 focus:ring-silk-brown text-right" onClick={(e) => e.stopPropagation()} />
                                                        </div>
                                                        <ul className="overflow-y-auto flex-1 max-h-52">
                                                            {processedNationalities.map((nat: any) => (
                                                                <li key={nat.value} onClick={() => { setFormData(prev => ({ ...prev, nationality: nat.value, nationality_iso: nat.iso?.toLowerCase(), nationality_label: nat.label })); setNatDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/5 last:border-0 font-bold text-md text-silk-dark">
                                                                    <img src={`https://flagcdn.com/w20/${nat.iso?.toLowerCase()}.png`} alt="" className="w-5 shadow-sm" />
                                                                    <span>{nat.label}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('age')}</label>
                                            <div onClick={() => setAgeDropdownOpen(!ageDropdownOpen)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all ${errors.age ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50'}`}>
                                                <span className={`font-bold ${formData.age ? 'text-silk-dark' : 'text-silk-dark/60'}`}>{formData.age ? formData.age : t('age')}</span>
                                                <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${ageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                            {ageDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setAgeDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-hidden bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col">
                                                        <ul className="overflow-y-auto flex-1 max-h-52">
                                                            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                                                <li key={num} onClick={() => { setFormData(prev => ({ ...prev, age: num.toString() })); setErrors(prev => ({ ...prev, age: '' })); setAgeDropdownOpen(false); }} className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/10 last:border-0 font-bold text-md text-center ${formData.age === num.toString() ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}>{num}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                            {errors.age && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.age}</p>}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-silk-sand/20 flex justify-end">
                                        <button type="submit" className="px-8 py-3.5 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">{t('next')}</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('check_in_date')}</label>
                                            <input type="date" name="check_in" value={formData.check_in} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.check_in ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                                            {errors.check_in && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.check_in}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('check_out_date')}</label>
                                            <input type="date" name="check_out" value={formData.check_out} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.check_out ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                                            {errors.check_out && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.check_out}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('guests_count')}</label>
                                            <input type="number" name="guests_count" value={formData.guests_count} onChange={handleInputChange} min="1" className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.guests_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                                            {errors.guests_count && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.guests_count}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-md font-bold text-silk-brown mb-2">{t('rooms_count')}</label>
                                            <input type="number" name="rooms_count" value={formData.rooms_count} onChange={handleInputChange} min="1" className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.rooms_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                                            {errors.rooms_count && <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.rooms_count}</p>}
                                        </div>
                                    </div>

                                    {formData.check_in && formData.check_out && !isCheckingResources && (
                                        <div className="mt-8">
                                            <h4 className="text-xl font-bold text-silk-brown mb-5 flex items-center gap-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                {t('suggested_rooms_title', 'الخيارات المقترحة لإقامتك')}
                                            </h4>

                                            {availableCombinations.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                                                    {availableCombinations.map((combo, idx) => {
                                                        const isSelected = selectedCombo === combo;
                                                        const capacity = combo.reduce((sum, r) => sum + r.guests, 0);
                                                        const requestedGuests = parseInt(formData.guests_count);

                                                        // 🌟 تحديد وسم (Badge) ذكي بناءً على سعة التجميعة
                                                        let badgeText = '';
                                                        let badgeColor = '';

                                                        if (idx === 0 && capacity === requestedGuests) {
                                                            badgeText = t('badge_exact_match', 'الخيار الأنسب (تطابق تام)');
                                                            badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                                                        } else if (idx === 0) {
                                                            badgeText = t('badge_best_value', 'أفضل قيمة متبقية');
                                                            badgeColor = 'bg-blue-100 text-blue-700 border-blue-200';
                                                        } else if (idx === 1) {
                                                            badgeText = t('badge_extra_space', 'مساحة إضافية وراحة');
                                                            badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
                                                        } else {
                                                            badgeText = t('badge_luxury_space', 'خيار الرفاهية الواسع');
                                                            badgeColor = 'bg-purple-100 text-purple-700 border-purple-200';
                                                        }

                                                        return (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 15 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                key={idx}
                                                                onClick={() => { setSelectedCombo(combo); if (errors.combination) setErrors(prev => ({ ...prev, combination: '' })); }}
                                                                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-center ${isSelected ? 'border-silk-brown bg-silk-brown/5 shadow-md scale-[1.01]' : 'border-silk-sand/30 bg-white/80 hover:bg-silk-cream hover:border-silk-sand'}`}
                                                            >
                                                                {/* الوسم الجمالي (Badge) */}
                                                                <div className={`absolute top-0 right-5 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor} shadow-sm`}>
                                                                    {badgeText}
                                                                </div>

                                                                <div className="flex justify-between items-center w-full">
                                                                    <div className="flex-1">
                                                                        <div
                                                                            className="text-lg text-silk-dark mb-2 leading-relaxed"
                                                                            dangerouslySetInnerHTML={{ __html: formatComboName(combo, t) }}
                                                                        />

                                                                        <div className="flex items-center gap-4 text-sm text-silk-dark/60 font-medium mt-2">
                                                                            <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-silk-sand/20">
                                                                                <svg className="w-4 h-4 text-silk-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                                                {t('capacity')}: {capacity} {t('persons')}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="w-6 h-6 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors duration-300 border-silk-brown ml-3 bg-white">
                                                                        <AnimatePresence>
                                                                            {isSelected && (
                                                                                <motion.div
                                                                                    initial={{ scale: 0 }}
                                                                                    animate={{ scale: 1 }}
                                                                                    exit={{ scale: 0 }}
                                                                                    className="w-3 h-3 bg-silk-brown rounded-full"
                                                                                />
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                                                    <svg className="w-12 h-12 text-rose-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <p className="text-rose-600 font-bold text-md">
                                                        {t('no_available_rooms')}
                                                    </p>
                                                    <p className="text-rose-500/80 text-sm mt-1">
                                                        {t('modify_search_hint', 'يرجى تعديل تواريخ الإقامة أو تقليل عدد الغرف المطلوبة.')}
                                                    </p>
                                                </div>
                                            )}
                                            {errors.combination && <p className="text-rose-600 text-sm mt-3 font-bold flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{errors.combination}</p>}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-md font-bold text-silk-brown mb-3">{t('extra_services')}</label>
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
                                        <label className="block text-md font-bold text-silk-brown mb-2">{t('special_notes')}</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-silk-sand/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark resize-none" placeholder={t('notes_placeholder')} />
                                    </div>

                                    {serverError && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-sm font-bold">{serverError}</div>}

                                    <div className="pt-4 border-t border-silk-sand/20 flex justify-between items-center gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 border border-silk-sand text-silk-brown hover:bg-silk-sand/10 font-bold rounded-xl transition-all duration-300 cursor-pointer">{t('back')}</button>
                                        <button type="submit" disabled={isLoading || !selectedCombo} className="flex-1 max-w-xs py-3.5 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
                                            {isLoading ? t('booking_loading') : t('confirm_booking')}
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


