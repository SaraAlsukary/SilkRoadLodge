import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { useBooking } from '../hooks/useBooking';
import { phoneCodesData } from '../utils/phoneCode';
import { LANGUAGE_PRIORITIES } from '../utils/languages';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

import BookingSuccess from '../components/booking/BookingSuccess';
import Step1PersonalInfo from '../components/booking/Step1PersonalInfo';
import Step2BookingDetails from '../components/booking/Step2BookingDetails';

export default function Booking() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const isRtl = currentLanguage === 'ar';

    const { createBooking, isLoading, error: serverError, success } = useBooking();

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [availableResources, setAvailableResources] = useState({ rooms: 0, doubles: 0, singles: 0 });
    const [isCheckingResources, setIsCheckingResources] = useState(false);
    const [hasFetchedResources, setHasFetchedResources] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', phone_code: '+963', phone_iso: 'sy',
        customer_phone: '', customer_email: '', gender: 'male',
        nationality: '', nationality_iso: '', nationality_label: '', age: '',
        guests_count: '1', rooms_count: '1', double_beds_count: '0', single_beds_count: '0',
        check_in: '', check_out: '', requested_services: [] as string[], notes: ''
    });

    // ✨ 1. تأثير للصعود التلقائي لأعلى الشاشة فور نجاح العملية
    useEffect(() => {
        if (success) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [success]);
    useEffect(() => {
        if (step === 2) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [step]);
    useEffect(() => {
        const fetchResources = async () => {
            if (formData.check_in && formData.check_out && new Date(formData.check_out) > new Date(formData.check_in)) {
                setIsCheckingResources(true);
                setHasFetchedResources(false);
                try {
                    const res = await fetch(`https://silkroadlodge.com/api/check-resources?check_in=${formData.check_in}&check_out=${formData.check_out}`);
                    // const res = await fetch(`http://localhost:8000/api/check-resources?check_in=${formData.check_in}&check_out=${formData.check_out}`);
                    if (res.ok) {
                        const data = await res.json();
                        setAvailableResources({
                            rooms: data.available_rooms,
                            doubles: data.available_doubles,
                            singles: data.available_singles
                        });
                        setHasFetchedResources(true);
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
    };

    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.first_name.trim()) newErrors.first_name = t('err_name_req') || 'الاسم الشخصي مطلوب';
        else if (formData.first_name.trim().length < 2) newErrors.first_name = t('err_name_short') || 'الاسم قصير جداً';

        if (!formData.last_name.trim()) newErrors.last_name = t('err_name_req') || 'الاسم الأخير مطلوب';
        else if (formData.last_name.trim().length < 2) newErrors.last_name = t('err_name_short') || 'الاسم قصير جداً';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.customer_email) newErrors.customer_email = t('err_email_req');
        else if (!emailRegex.test(formData.customer_email)) newErrors.customer_email = t('err_email_inv');

        if (!formData.customer_phone) {
            newErrors.customer_phone = t('err_phone_req');
        } else {
            const isValid = isValidPhoneNumber(formData.customer_phone, formData.phone_iso.toUpperCase() as CountryCode);
            if (!isValid) newErrors.customer_phone = t('err_phone_inv', 'رقم الهاتف غير صالح لهذه الدولة');
        }
        if (!formData.nationality.trim()) newErrors.nationality = t('err_nat_req');

        const ageNum = parseInt(formData.age);
        if (!formData.age || isNaN(ageNum)) newErrors.age = t('err_age_req');

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

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        const guestsInt = parseInt(formData.guests_count) || 0;
        const roomsInt = parseInt(formData.rooms_count) || 0;
        const doublesInt = parseInt(formData.double_beds_count) || 0;
        const singlesInt = parseInt(formData.single_beds_count) || 0;

        if (guestsInt < 1) newErrors.guests_count = t('err_guests_min');
        if (roomsInt < 1) newErrors.rooms_count = t('err_rooms_min');
        if (doublesInt < 0) newErrors.double_beds_count = t('err_double_beds_min');
        if (singlesInt < 0) newErrors.single_beds_count = t('err_single_beds_min');

        if (hasFetchedResources) {
            if (roomsInt > availableResources.rooms) newErrors.rooms_count = t('err_rooms_max', { max: availableResources.rooms });
            if (doublesInt > availableResources.doubles) newErrors.double_beds_count = t('err_double_beds_max', { max: availableResources.doubles });
            if (singlesInt > availableResources.singles) newErrors.single_beds_count = t('err_single_beds_max', { max: availableResources.singles });
        }

        const totalBedCapacity = (doublesInt * 2) + singlesInt;
        if (totalBedCapacity < guestsInt && !newErrors.guests_count && !newErrors.double_beds_count && !newErrors.single_beds_count) {
            newErrors.combination = t('err_capacity_insufficient', { bedCapacity: totalBedCapacity, guestsCount: guestsInt });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) { if (validateStep1()) setStep(2); return; }
        if (!validateStep2()) return;

        const roomsInt = parseInt(formData.rooms_count);
        const doublesInt = parseInt(formData.double_beds_count);
        const singlesInt = parseInt(formData.single_beds_count);
        const bookedRoomNames = `${roomsInt} × غرف (${doublesInt} أسرة مزدوجة + ${singlesInt} أسرة مفردة)`;

        try {
            await createBooking({
                ...formData,
                customer_name: `${formData.first_name} ${formData.last_name}`.trim(),
                customer_phone: `${formData.phone_code} ${formData.customer_phone}`,
                age: parseInt(formData.age),
                guests_count: parseInt(formData.guests_count),
                rooms_count: roomsInt,
                double_beds_count: doublesInt,
                single_beds_count: singlesInt,
                booked_room_names: bookedRoomNames
            });
        } catch (err) { }
    };

    // 💡 تمت إزالة الـ return المبكر القديم من هنا للاحتفاظ بحاوية الـ section الأساسية وبقاء الطول الكامل للصفحة.

    return (
        <section className="min-h-screen py-16 px-4 md:px-8 bg-silk-cream text-silk-dark transition-colors duration-300">
            <div className="max-w-3xl mx-auto">

                {/* ✨ 2. إخفاء الهيدر وخطوات الحجز فقط في حال نجاح العملية ليعرض كرت النجاح بشكل نظيف ومستقل */}
                {!success && (
                    <>
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
                    </>
                )}

                <div className={`   ${success ? " " : "border border-silk-sand/20 bg-white/40 backdrop-blur-md   rounded-2xl p-6 md:p-10 shadow-xl"}`}>
                    {/* ✨ 3. عرض مكون النجاح داخل الكارد الرئيسي بدلاً من الفورم عند اكتمال الحجز */}
                    {success ? (
                        <BookingSuccess t={t} />
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <Step1PersonalInfo
                                        formData={formData}
                                        setFormData={setFormData}
                                        errors={errors}
                                        setErrors={setErrors}
                                        handleInputChange={handleInputChange}
                                        t={t}
                                        isRtl={isRtl}
                                        currentLanguage={currentLanguage}
                                    />
                                )}
                                {step === 2 && (
                                    <Step2BookingDetails
                                        formData={formData}
                                        setFormData={setFormData}
                                        errors={errors}
                                        setErrors={setErrors}
                                        handleInputChange={handleInputChange}
                                        setStep={setStep}
                                        availableResources={availableResources}
                                        hasFetchedResources={hasFetchedResources}
                                        isLoading={isLoading}
                                        isCheckingResources={isCheckingResources}
                                        serverError={serverError}
                                        t={t}
                                        isRtl={isRtl}
                                    />
                                )}
                            </AnimatePresence>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}