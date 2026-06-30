import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { nationalitiesData } from '../../utils/countries';
import { phoneCodesData } from '../../utils/phoneCode';
import { LANGUAGE_PRIORITIES } from '../../utils/languages';
interface Step1Props {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    t: any;
    isRtl: boolean;
    currentLanguage: string;
}

export default function Step1PersonalInfo({ formData, setFormData, errors, setErrors, handleInputChange, t, isRtl, currentLanguage }: Step1Props) {
    const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
    const [natDropdownOpen, setNatDropdownOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
    const [phoneSearch, setPhoneSearch] = useState('');
    const [natSearch, setNatSearch] = useState('');

    const currentNationalities = nationalitiesData[currentLanguage] || nationalitiesData['en'] || [];
    const getCountryNameByIso = (iso: string) => currentNationalities.find((n: any) => n.iso?.toLowerCase() === iso?.toLowerCase())?.label || '';

    const processedPhoneCodes = useMemo(() => {
        const search = phoneSearch.toLowerCase();
        const priorities = LANGUAGE_PRIORITIES[currentLanguage] || [];

        // 1. تصفية البيانات بناءً على البحث
        const filtered = phoneCodesData.filter(pc =>
            pc.code.includes(search) ||
            pc.iso.toLowerCase().includes(search) ||
            getCountryNameByIso(pc.iso).toLowerCase().includes(search)
        );

        // 2. ترتيب النتائج المفلترة لتظهر دول الأولوية أولاً
        return filtered.sort((a, b) => {
            const indexA = priorities.indexOf(a.iso.toLowerCase());
            const indexB = priorities.indexOf(b.iso.toLowerCase());

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // ✨ ترتيب أبجدي لأسماء الدول في القائمة المنسدلة للأرقام
            const nameA = getCountryNameByIso(a.iso);
            const nameB = getCountryNameByIso(b.iso);
            return nameA.localeCompare(nameB, currentLanguage);
        });
    }, [phoneSearch, currentLanguage]); // تأكد من وجود currentLanguage في المصفوفة هنا

    // ✨ تحديث معالجة الجنسيات (بحث + ترتيب الأولويات)
    const processedNationalities = useMemo(() => {
        const search = natSearch.toLowerCase();
        const priorities = LANGUAGE_PRIORITIES[currentLanguage] || [];

        const filtered = currentNationalities.filter((nat: any) =>
            nat.label.toLowerCase().includes(search) ||
            nat.iso?.toLowerCase().includes(search)
        );

        return filtered.sort((a: any, b: any) => {
            const indexA = priorities.indexOf(a.iso?.toLowerCase());
            const indexB = priorities.indexOf(b.iso?.toLowerCase());

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // ✨ السطر السحري: ترتيب باقي الدول أبجدياً حسب لغة الواجهة!
            return a.label.localeCompare(b.label, currentLanguage);
        });
    }, [natSearch, currentLanguage, currentNationalities]);
    return (
        <motion.div key="step1" initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? -20 : 20 }} transition={{ duration: 0.3 }} className="space-y-5">
            <h3 className="text-2xl font-bold text-silk-brown border-b border-silk-sand/30 pb-2 mb-4">{t('personal_info')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('first_name') || 'الاسم الشخصي'}</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark ${errors.first_name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="John" />
                    {errors.first_name && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.first_name}</p>}
                </div>
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('last_name') || 'اسم العائلة'}</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark ${errors.last_name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="Doe" />
                    {errors.last_name && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.last_name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('phone_number')}</label>
                    <div dir='rtl' className={`flex flex-row-reverse xl:flex-row-reverse rounded-xl border bg-white/80 focus-within:ring-2 focus-within:ring-silk-brown/50 transition-all relative ${errors.customer_phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>
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
                                            <input type="text" value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} placeholder={t('search_placeholder')} className="w-full px-3 py-1.5 text-md rounded-lg border border-silk-sand/30 bg-white focus:outline-none focus:ring-1 focus:ring-silk-brown text-right" onClick={(e) => e.stopPropagation()} />
                                        </div>
                                        <ul className="overflow-y-auto flex-1 max-h-48">
                                            {processedPhoneCodes.map((pc, idx) => (
                                                <li key={idx} onClick={() => { setFormData((prev: any) => ({ ...prev, phone_code: pc.code, phone_iso: pc.iso })); setPhoneDropdownOpen(false); }} className="flex items-center justify-between px-4 py-2 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/5 last:border-0">
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
                    {errors.customer_phone && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.customer_phone}</p>}
                </div>
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('email_address')}</label>
                    <input type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} dir='ltr' className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-left dir-ltr ${errors.customer_email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} placeholder="info@silkroadlodge.com" />
                    {errors.customer_email && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.customer_email}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('gender')}</label>
                    <div onClick={() => setGenderDropdownOpen(!genderDropdownOpen)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border bg-white/80 cursor-pointer transition-all border-silk-sand/40 focus:ring-2 focus:ring-silk-brown/50`}>
                        <span className="font-bold text-silk-dark">{t(formData.gender)}</span>
                        <svg className={`w-4 h-4 text-silk-dark/60 transition-transform ${genderDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    {genderDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setGenderDropdownOpen(false)}></div>
                            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-silk-sand/30 rounded-xl shadow-xl z-20 flex flex-col overflow-hidden">
                                <ul className="flex-1">
                                    {['male', 'female'].map(g => (
                                        <li key={g} onClick={() => { setFormData((prev: any) => ({ ...prev, gender: g })); setGenderDropdownOpen(false); }} className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/10 font-bold text-xl ${formData.gender === g ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}>{t(g)}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
                <div className="relative">
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('nationality')}</label>
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
                                        <li key={nat.value} onClick={() => { setFormData((prev: any) => ({ ...prev, nationality: nat.value, nationality_iso: nat.iso?.toLowerCase(), nationality_label: nat.label })); setErrors((prev: any) => ({ ...prev, nationality: '' })); setNatDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/5 last:border-0 font-bold text-xl text-silk-dark">
                                            <img src={`https://flagcdn.com/w20/${nat.iso?.toLowerCase()}.png`} alt="" className="w-5 shadow-sm" />
                                            <span>{nat.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                    {errors.nationality && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.nationality}</p>}
                </div>
                <div className="relative">
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('age')}</label>
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
                                        <li key={num} onClick={() => { setFormData((prev: any) => ({ ...prev, age: num.toString() })); setErrors((prev: any) => ({ ...prev, age: '' })); setAgeDropdownOpen(false); }} className={`px-4 py-3 hover:bg-silk-sand/20 cursor-pointer transition-colors border-b border-silk-sand/10 last:border-0 font-bold text-xl text-center ${formData.age === num.toString() ? 'text-silk-brown bg-silk-cream/50' : 'text-silk-dark'}`}>{num}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                    {errors.age && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.age}</p>}
                </div>
            </div>

            <div className="pt-4 border-t border-silk-sand/20 flex justify-end">
                <button type="submit" className="px-8 py-3.5 bg-silk-brown hover:bg-silk-dark text-silk-cream text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">{t('next')}</button>
            </div>
        </motion.div>
    );
}