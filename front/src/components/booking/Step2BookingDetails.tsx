import React from 'react';
import { motion } from 'framer-motion';

interface Step2Props {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    setStep: (step: number) => void;
    availableResources: { rooms: number, doubles: number, singles: number };
    hasFetchedResources: boolean;
    isLoading: boolean;
    isCheckingResources: boolean;
    serverError: any;
    t: any;
    isRtl: boolean;
}

export default function Step2BookingDetails({ formData, setFormData, errors, setErrors, handleInputChange, setStep, availableResources, hasFetchedResources, isLoading, isCheckingResources, serverError, t, isRtl }: Step2Props) {

    const handleCounterChange = (field: string, increment: boolean, min: number, max?: number) => {
        const currentValue = parseInt(formData[field] as string) || 0;
        let newValue = increment ? currentValue + 1 : currentValue - 1;

        if (newValue < min) return;

        if (max !== undefined && newValue > max) {
            let errorMessage = '';
            if (field === 'rooms_count') errorMessage = t('err_rooms_max', { max }) || `عذراً، أقصى عدد متاح للغرف هو ${max}`;
            else if (field === 'double_beds_count') errorMessage = t('err_double_beds_max', { max }) || `عذراً، أقصى عدد متاح للأسرة المزدوجة هو ${max}`;
            else if (field === 'single_beds_count') errorMessage = t('err_single_beds_max', { max }) || `عذراً، أقصى عدد متاح للأسرة المفردة هو ${max}`;
            else errorMessage = `الحد الأقصى المتاح هو ${max}`;

            setErrors(prev => ({ ...prev, [field]: errorMessage }));
            return;
        }

        setFormData((prev:any) => ({ ...prev, [field]: newValue.toString() }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
        if (errors.combination && ['double_beds_count', 'single_beds_count', 'guests_count'].includes(field)) {
            setErrors(prev => ({ ...prev, combination: '' }));
        }
    };

    const handleCheckboxChange = (service: string) => {
        setFormData((prev:any) => ({
            ...prev,
            requested_services: prev.requested_services.includes(service)
                ? prev.requested_services.filter((s: string) => s !== service)
                : [...prev.requested_services, service]
        }));
    };

    const availableServices = [
        { id: 'breakfast', label: t('service_breakfast') },
        { id: 'lunch', label: t('service_lunch') },
        { id: 'dinner', label: t('service_dinner') },
        { id: 'bedouin_tent_title', label: t('bedouin_tent_title') },
        { id: 'safari_tour_title', label: t('safari_tour_title') },
        { id: 'bicycles_title', label: t('bicycles_title') },
        { id: 'airport_pickup_title', label: t('airport_pickup_title') },
        { id: 'syria_tour_title', label: t('syria_tour_title') },
    ];

    return (
        <motion.div key="step2" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }} transition={{ duration: 0.3 }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('check_in_date')}</label>
                    <input type="date" name="check_in" value={formData.check_in} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.check_in ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                    {errors.check_in && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.check_in}</p>}
                </div>
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('check_out_date')}</label>
                    <input type="date" name="check_out" value={formData.check_out} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-bold transition-all text-silk-dark ${errors.check_out ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`} />
                    {errors.check_out && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.check_out}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('guests_count')}</label>
                    <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border bg-white/80 transition-all ${errors.guests_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>
                        <button type="button" onClick={() => handleCounterChange('guests_count', false, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand/20 hover:bg-silk-sand/40 text-silk-brown font-bold text-xl transition-colors">-</button>
                        <span className="font-bold text-silk-dark text-lg w-8 text-center">{formData.guests_count}</span>
                        <button type="button" onClick={() => handleCounterChange('guests_count', true, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-brown hover:bg-silk-dark text-white font-bold text-xl transition-colors">+</button>
                    </div>
                    {errors.guests_count && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.guests_count}</p>}
                </div>
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('rooms_count')}</label>
                    <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border bg-white/80 transition-all ${errors.rooms_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>
                        <button type="button" onClick={() => handleCounterChange('rooms_count', false, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand/20 hover:bg-silk-sand/40 text-silk-brown font-bold text-xl transition-colors">-</button>
                        <span className="font-bold text-silk-dark text-lg w-8 text-center">{formData.rooms_count}</span>
                        <button type="button" onClick={() => handleCounterChange('rooms_count', true, 1, hasFetchedResources ? availableResources.rooms : undefined)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-brown hover:bg-silk-dark text-white font-bold text-xl transition-colors">+</button>
                    </div>
                    {errors.rooms_count && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.rooms_count}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('single_beds_input_label')}</label>
                    <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border bg-white/80 transition-all ${errors.single_beds_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>
                        <button type="button" onClick={() => handleCounterChange('single_beds_count', false, 0)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand/20 hover:bg-silk-sand/40 text-silk-brown font-bold text-xl transition-colors">-</button>
                        <span className="font-bold text-silk-dark text-lg w-8 text-center">{formData.single_beds_count}</span>
                        <button type="button" onClick={() => handleCounterChange('single_beds_count', true, 0, hasFetchedResources ? availableResources.singles : undefined)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-brown hover:bg-silk-dark text-white font-bold text-xl transition-colors">+</button>
                    </div>
                    {errors.single_beds_count && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.single_beds_count}</p>}
                </div>
                <div>
                    <label className="block text-xl font-bold text-silk-brown mb-2">{t('double_beds_input_label')}</label>
                    <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border bg-white/80 transition-all ${errors.double_beds_count ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-silk-sand/40'}`}>
                        <button type="button" onClick={() => handleCounterChange('double_beds_count', false, 0)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand/20 hover:bg-silk-sand/40 text-silk-brown font-bold text-xl transition-colors">-</button>
                        <span className="font-bold text-silk-dark text-lg w-8 text-center">{formData.double_beds_count}</span>
                        <button type="button" onClick={() => handleCounterChange('double_beds_count', true, 0, hasFetchedResources ? availableResources.doubles : undefined)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-brown hover:bg-silk-dark text-white font-bold text-xl transition-colors">+</button>
                    </div>
                    {errors.double_beds_count && <p className="text-rose-600 text-md mt-1.5 font-bold">{errors.double_beds_count}</p>}
                </div>
            </div>

            {errors.combination && (
                <p className="text-rose-600 text-md mt-3 font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {errors.combination}
                </p>
            )}

            <div className="pt-2">
                <label className="block text-xl font-bold text-silk-brown mb-3">{t('extra_services')}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {availableServices.map(service => (
                        <label key={service.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.requested_services.includes(service.id) ? 'border-silk-brown bg-silk-brown/10 font-bold' : 'border-silk-sand/30 bg-white/60 hover:bg-white/90'}`}>
                            <input type="checkbox" checked={formData.requested_services.includes(service.id)} onChange={() => handleCheckboxChange(service.id)} className="w-4 h-4 accent-silk-brown rounded" />
                            <span className="text-xl text-silk-dark">{service.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xl font-bold text-silk-brown mb-2">{t('special_notes')}</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-silk-sand/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-silk-brown/50 font-medium transition-all text-silk-dark resize-none" placeholder={t('notes_placeholder')} />
            </div>

            {serverError && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-xl font-bold">{serverError}</div>}

            <div className="pt-4 border-t border-silk-sand/20 flex justify-between items-center gap-4">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 border border-silk-sand text-silk-brown hover:bg-silk-sand/10 font-bold rounded-xl transition-all duration-300 cursor-pointer">{t('back')}</button>
                <button type="submit" disabled={isLoading || isCheckingResources} className="flex-1 max-w-xs py-3.5 bg-silk-brown hover:bg-silk-dark text-silk-cream font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
                    {isLoading ? t('booking_loading') : t('confirm_booking')}
                </button>
            </div>
        </motion.div>
    );
}