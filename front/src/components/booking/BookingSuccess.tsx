import { motion } from 'framer-motion';

interface BookingSuccessProps {
    t: any;
}

export default function BookingSuccess({ t }: BookingSuccessProps) {
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