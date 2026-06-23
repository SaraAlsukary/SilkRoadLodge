
export const Icons = {
    Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 001 1m-6 0h6" /></svg>,
    List: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Moon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    Sun: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Check: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    Alert: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
};

export const STATUS_MAP: Record<string, string> = {
    confirmed: 'مؤكد',
    cancelled: 'ملغى',
};

export const initialFormState = {
    first_name: '', last_name: '', phone_code: '+963', phone_iso: 'sy', customer_phone: '', customer_email: '',
    gender: 'ذكر', nationality: '', nationality_iso: '', nationality_label: '', age: '',
    guests_count: '1', rooms_count: '1', double_beds_count: '0', single_beds_count: '0',
    check_in: '', check_out: '', requested_services: [] as string[], notes: ''
};

export const availableServices = [
    { id: 'breakfast', label: "وجبة إفطار" },
    { id: 'lunch', label: "وجبة غداء" },
    { id: 'dinner', label: "وجبة عشاء" },
    { id: 'bedouin_tent_title', label: 'الخيمة البدوية' },
    { id: 'safari_tour_title', label: 'رحلات الخيول والجمال' },
    { id: 'bicycles_title', label: "تأجير الدراجات هوائية" },
    { id: 'airport_pickup_title', label: "خدمة النقل من وإلى المطار" },
    { id: 'syria_tour_title', label: "جولة سياحية في سوريا" },
];

export const sidebarNavigation = [
    { id: 'dashboard', name: 'الرئيسية', icon: Icons.Home },
    { id: 'list', name: 'سجل الحجوزات', icon: Icons.List },
    { id: 'add', name: 'إضافة حجز جديد', icon: Icons.Plus },
];

export const getTheme = (isDarkMode: boolean) => ({
    bg: isDarkMode ? 'bg-silk-dark text-silk-cream' : 'bg-gray-50 text-gray-900',
    sidebar: isDarkMode ? 'bg-silk-dark border-silk-sand/10' : 'bg-white border-gray-200',
    header: isDarkMode ? 'bg-silk-dark/80 border-silk-sand/10' : 'bg-white/80 border-gray-200',
    card: isDarkMode ? 'bg-white/5 border-silk-sand/10 shadow-2xl' : 'bg-white border-gray-200 shadow-xl',
    input: isDarkMode ? 'bg-black/40 border-silk-sand/20 focus:border-silk-sand text-white' : 'bg-gray-50 border-gray-300 focus:border-gray-900',
    dropdown: isDarkMode ? 'bg-silk-dark border-silk-sand/20 text-white' : 'bg-white border-gray-200 text-gray-900',
    dropdownItemHover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100',
    modalBg: isDarkMode ? 'bg-silk-dark border border-silk-sand/20' : 'bg-white border border-gray-200',
});