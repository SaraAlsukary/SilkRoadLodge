import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../hooks/useBooking';
import { nationalitiesData } from '../utils/countries';
import { phoneCodesData } from '../utils/phoneCode';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  List: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
};

export default function AdminDashboard() {

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('list');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [showSuccess, setShowSuccess] = useState(false);

  const [bookings, setBookings] = useState([
    { id: 1, guestName: 'أحمد محمود', room: 3,double:2,single:1 ,checkIn: '2026-07-01', checkOut: '2026-07-05', status: 'مؤكد' },
    { id: 2, guestName: 'سارة خالد', room: 2,double:1,single:1 ,checkIn: '2026-07-03', checkOut: '2026-07-07', status: 'قيد الانتظار' },
  ]);

  // --- حالات نموذج الحجز المتقدم ---
  const { createBooking, isLoading, error: serverError } = useBooking();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableResources, setAvailableResources] = useState({ rooms: 0, doubles: 0, singles: 0 });
  const [isCheckingResources, setIsCheckingResources] = useState(false);
  const [hasFetchedResources, setHasFetchedResources] = useState(false);

  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [natDropdownOpen, setNatDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [natSearch, setNatSearch] = useState('');

  const initialFormState = {
    first_name: '', last_name: '', phone_code: '+963', phone_iso: 'sy', customer_phone: '', customer_email: '',
    gender: 'ذكر', nationality: '', nationality_iso: '', nationality_label: '', age: '',
    guests_count: '1', rooms_count: '1', double_beds_count: '0', single_beds_count: '0',
    check_in: '', check_out: '', requested_services: [] as string[], notes: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // جلب الموارد المتاحة عند تغيير التواريخ
  useEffect(() => {
    const fetchResources = async () => {
      if (formData.check_in && formData.check_out && new Date(formData.check_out) > new Date(formData.check_in)) {
        setIsCheckingResources(true);
        setHasFetchedResources(false);
        try {
          const res = await fetch(`https://silkroadlodge.com/api/check-resources?check_in=${formData.check_in}&check_out=${formData.check_out}`);
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
          console.error("فشل في جلب الموارد المتاحة", err);
        } finally {
          setIsCheckingResources(false);
        }
      }
    };
    fetchResources();
  }, [formData.check_in, formData.check_out]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCounterChange = (field: string, increment: boolean, min: number, max?: number) => {
    const currentValue = parseInt(formData[field as keyof typeof formData] as string) || 0;
    let newValue = increment ? currentValue + 1 : currentValue - 1;

    if (newValue < min) return;

    if (max !== undefined && newValue > max) {
      let errorMessage = '';
      if (field === 'rooms_count') errorMessage = `عذراً، أقصى عدد متاح للغرف هو ${max}`;
      else if (field === 'double_beds_count') errorMessage = `عذراً، أقصى عدد متاح للأسرّة المزدوجة هو ${max}`;
      else if (field === 'single_beds_count') errorMessage = `عذراً، أقصى عدد متاح للأسرّة المفردة هو ${max}`;
      else errorMessage = `الحد الأقصى المتاح هو ${max}`;

      setErrors(prev => ({ ...prev, [field]: errorMessage }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: newValue.toString() }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (errors.combination && ['double_beds_count', 'single_beds_count', 'guests_count'].includes(field)) {
      setErrors(prev => ({ ...prev, combination: '' }));
    }
  };

  const handleCheckboxChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      requested_services: prev.requested_services.includes(service)
        ? prev.requested_services.filter(s => s !== service)
        : [...prev.requested_services, service]
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'الاسم الشخصي مطلوب';
    else if (formData.first_name.trim().length < 2) newErrors.first_name = 'الاسم قصير جداً';

    if (!formData.last_name.trim()) newErrors.last_name = 'اسم العائلة مطلوب';
    else if (formData.last_name.trim().length < 2) newErrors.last_name = 'الاسم قصير جداً';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customer_email) newErrors.customer_email = 'البريد الإلكتروني مطلوب';
    else if (!emailRegex.test(formData.customer_email)) newErrors.customer_email = 'البريد الإلكتروني غير صالح';

    if (!formData.customer_phone) {
      newErrors.customer_phone = 'رقم الهاتف مطلوب';
    } else {
      const isValid = isValidPhoneNumber(formData.customer_phone, formData.phone_iso.toUpperCase() as CountryCode);
      if (!isValid) newErrors.customer_phone = 'رقم الهاتف غير صالح لهذه الدولة';
    }

    if (!formData.nationality.trim()) newErrors.nationality = 'الجنسية مطلوبة';
    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum)) newErrors.age = 'العمر مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.check_in) newErrors.check_in = 'تاريخ الوصول مطلوب';
    else if (new Date(formData.check_in) < today) newErrors.check_in = 'لا يمكن الحجز في تاريخ ماضي';

    if (!formData.check_out) newErrors.check_out = 'تاريخ المغادرة مطلوب';
    else if (formData.check_in && new Date(formData.check_out) <= new Date(formData.check_in)) {
      newErrors.check_out = 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    const guestsInt = parseInt(formData.guests_count) || 0;
    const roomsInt = parseInt(formData.rooms_count) || 0;
    const doublesInt = parseInt(formData.double_beds_count) || 0;
    const singlesInt = parseInt(formData.single_beds_count) || 0;

    if (guestsInt < 1) newErrors.guests_count = 'عدد النزلاء يجب أن يكون 1 على الأقل';
    if (roomsInt < 1) newErrors.rooms_count = 'يجب حجز غرفة واحدة على الأقل';

    if (hasFetchedResources) {
      if (roomsInt > availableResources.rooms) newErrors.rooms_count = `عذراً، أقصى عدد متاح للغرف هو ${availableResources.rooms}`;
      if (doublesInt > availableResources.doubles) newErrors.double_beds_count = `أقصى عدد متاح للأسرّة المزدوجة هو ${availableResources.doubles}`;
      if (singlesInt > availableResources.singles) newErrors.single_beds_count = `أقصى عدد متاح للأسرّة المفردة هو ${availableResources.singles}`;
    }

    const totalBedCapacity = (doublesInt * 2) + singlesInt;
    if (totalBedCapacity < guestsInt && !newErrors.guests_count && !newErrors.double_beds_count && !newErrors.single_beds_count) {
      newErrors.combination = `سعة الأسرّة الحالية (${totalBedCapacity} شخص) لا تكفي لعدد النزلاء (${guestsInt} أشخاص)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { if (validateStep1()) setStep(2); return; }
    if (!validateStep2()) return;

    const roomsInt = parseInt(formData.rooms_count);
    const doublesInt = parseInt(formData.double_beds_count);
    const singlesInt = parseInt(formData.single_beds_count);
    const bookedRoomNames = `${roomsInt} × غرف (${doublesInt} أسرّة مزدوجة + ${singlesInt} أسرّة مفردة)`;

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

      // نجاح العملية
      // setBookings([{
      //   id: Date.now(),
      //   guestName: `${formData.first_name} ${formData.last_name}`.trim(),
      //   room: `${roomsInt} `,
      //   checkIn: formData.check_in,
      //   checkOut: formData.check_out,
      //   status: 'مؤكد'
      // }, ...bookings]);

      setFormData(initialFormState);
      setStep(1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveSidebarItem('list');
      }, 1500);

    } catch (err) { console.error(err); }
  };

  const handleDelete = (id: number) => setBookings(bookings.filter(b => b.id !== id));
  const filteredBookings = bookings.filter(b => statusFilter === 'الكل' ? true : b.status === statusFilter);

  const availableServices = [
    { id: 'breakfast', label: 'إفطار' },
    { id: 'lunch', label: 'غداء' },
    { id: 'dinner', label: 'عشاء' },
    { id: 'bedouin_tent_title', label: 'خيمة بدوية' },
    { id: 'safari_tour_title', label: 'جولة سفاري' },
    { id: 'bicycles_title', label: 'دراجات هوائية' },
    { id: 'airport_pickup_title', label: 'توصيل من/إلى المطار' },
    { id: 'syria_tour_title', label: 'جولة سياحية' },
  ];

  const currentNationalities = nationalitiesData['ar'] || nationalitiesData['en'] || [];
  const getCountryNameByIso = (iso: string) => currentNationalities.find((n: any) => n.iso?.toLowerCase() === iso?.toLowerCase())?.label || '';

  const processedPhoneCodes = useMemo(() => {
    const search = phoneSearch.toLowerCase();
    return phoneCodesData.filter(pc => pc.code.includes(search) || pc.iso.toLowerCase().includes(search) || getCountryNameByIso(pc.iso).toLowerCase().includes(search));
  }, [phoneSearch]);

  const processedNationalities = useMemo(() => {
    const search = natSearch.toLowerCase();
    return currentNationalities.filter((nat: any) => nat.label.toLowerCase().includes(search) || nat.iso?.toLowerCase().includes(search));
  }, [natSearch]);

  const theme = {
    bg: isDarkMode ? 'bg-silk-dark text-silk-cream' : 'bg-gray-50 text-gray-900',
    sidebar: isDarkMode ? 'bg-silk-dark border-silk-sand/10' : 'bg-white border-gray-200',
    header: isDarkMode ? 'bg-silk-dark/80 border-silk-sand/10' : 'bg-white/80 border-gray-200',
    card: isDarkMode ? 'bg-white/5 border-silk-sand/10 shadow-2xl' : 'bg-white border-gray-200 shadow-xl',
    input: isDarkMode ? 'bg-black/40 border-silk-sand/20 focus:border-silk-sand text-white' : 'bg-gray-50 border-gray-300 focus:border-gray-900',
    dropdown: isDarkMode ? 'bg-silk-dark border-silk-sand/20 text-white' : 'bg-white border-gray-200 text-gray-900',
    dropdownItemHover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100',
  };

  const sidebarNavigation = [
    { id: 'dashboard', name: 'الرئيسية', icon: Icons.Home },
    { id: 'list', name: 'سجل الحجوزات', icon: Icons.List },
    { id: 'add', name: 'إضافة حجز جديد', icon: Icons.Plus },
  ];

  const getPageTitle = () => {
    const item = sidebarNavigation.find(nav => nav.id === activeSidebarItem);
    return item ? item.name : 'لوحة التحكم';
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme.bg}`} dir="rtl">

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
            <Icons.Check /> تم إضافة الحجز بنجاح
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 right-0 z-50 w-72 transform transition-transform duration-300 border-l ${theme.sidebar} lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-inherit">
          <h2 className="text-2xl font-black text-silk-sand tracking-tighter font-sans">SILK ROAD LODGE</h2>
          <p className="text-[10px] uppercase tracking-[4px] opacity-40 mt-1 font-sans">Dashboard Hotel Management</p>
        </div>
        <nav className="p-6 space-y-3">
          {sidebarNavigation.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSidebarItem(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-xl ${activeSidebarItem === item.id
                ? 'bg-silk-sand text-silk-dark font-bold shadow-lg shadow-silk-sand/20'
                : `opacity-60 hover:opacity-100 hover:bg-silk-sand/10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`
                }`}
            >
              <item.icon />
              <span className={activeSidebarItem === item.id ? "font-bold" : "font-medium"}>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className={`h-24 sticky top-0 z-30 border-b backdrop-blur-xl ${theme.header} flex items-center justify-between px-8`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl"><Icons.Menu /></button>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <div className="h-10 w-[1px] bg-silk-sand/20" />
            <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block ">
                <p className="text-xl font-bold">المدير العام</p>
                <p className="text-md opacity-50">info@silkroadlodge.com</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-silk-sand text-silk-dark flex items-center justify-center font-black text-xl">S</div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {activeSidebarItem === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-20 opacity-50">
                <Icons.Home />
                <h2 className="mt-4 text-xl font-bold">مرحباً بك في لوحة تحكم SILK ROAD</h2>
                <p className="text-xl mt-2">اختر "سجل الحجوزات" أو "إضافة حجز" من القائمة الجانبية</p>
              </motion.div>
            )}

            {activeSidebarItem === 'list' && (
              <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-silk-sand animate-pulse" />
                    قائمة النزلاء الحالية
                  </h3>
                  <div className="flex gap-2 p-1.5 bg-black/10 dark:bg-white/5 rounded-2xl w-fit border border-inherit">
                    {['الكل', 'مؤكد', 'قيد الانتظار'].map(f => (
                      <button key={f} onClick={() => setStatusFilter(f)}
                        className={`px-5 py-2 rounded-xl text-md font-bold transition-all ${statusFilter === f ? 'bg-silk-sand text-silk-dark shadow-md' : 'hover:bg-white/5 opacity-70'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`rounded-3xl overflow-x-auto border ${theme.card}`}>
                  <table className="w-full text-right min-w-[700px]">
                    <thead className="bg-black/20 text-md uppercase tracking-widest opacity-50">
                      <tr>
                        <th className="p-6  font-semibold">الضيف</th>
                        <th className="p-6 font-semibold">عدد الغرف</th>
                        <th className="p-6 font-semibold">الأسرّة المفردة</th>
                        <th className="p-6 font-semibold">الأسرّة المزدوجة</th>
                        <th className="p-6 text-center font-semibold">التاريخ</th>
                        <th className="p-6 text-center font-semibold">الحالة</th>
                        <th className="p-6 text-center font-semibold">التحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                      {filteredBookings.map(b => (
                        <motion.tr key={b.id} layout className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="p-6">
                            <p className="font-bold text-xl">{b.guestName}</p>
                            <p className="text-[10px] opacity-50 mt-1">GUEST ID: #{b.id}</p>
                          </td>
                          <td className="p-6 font-medium text-silk-sand text-xl">{b.room}</td>
                          <td className="p-6 font-medium text-silk-sand text-xl">{b.single}</td>
                          <td className="p-6 font-medium text-silk-sand text-xl">{b.double}</td>
                          <td className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-md opacity-70 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{b.checkIn}</span>
                              <span className="opacity-30 text-md">→</span>
                              <span className="text-md opacity-70 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{b.checkOut}</span>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[15px] font-black inline-block ${b.status === 'مؤكد' ? 'bg-green-500/10 text-green-500 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-6 text-center">
                            <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl text-md font-bold transition-colors">
                              إلغاء الحجز
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredBookings.length === 0 && (
                    <div className="p-12 text-center opacity-50 flex flex-col items-center">
                      <Icons.List />
                      <p className="mt-4 text-xl font-bold">لا يوجد حجوزات مطابقة للبحث</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* النموذج المتقدم المدمج */}
            {activeSidebarItem === 'add' && (
              <motion.div key="add" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex justify-center">
                <div className={`w-full max-w-4xl p-8 lg:p-10 rounded-[30px] border ${theme.card}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">تسجيل حجز جديد متقدم</h3>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xl transition-all ${step >= 1 ? 'bg-silk-sand text-silk-dark shadow-md' : 'bg-white/10 text-white/50'}`}>1</div>
                      <div className={`w-16 h-0.5 rounded-full ${step === 2 ? 'bg-silk-sand' : 'bg-black/20'}`}></div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xl transition-all ${step === 2 ? 'bg-silk-sand text-silk-dark shadow-md' : 'bg-black/20 text-black/50'}`}>2</div>
                    </div>
                  </div>

                  <form onSubmit={handleBookingSubmit} noValidate className="space-y-6">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                          <h4 className="text-lg font-bold border-b border-silk-sand/20 pb-2 mb-4">المعلومات الشخصية</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">الاسم الشخصي</label>
                              <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.input} ${errors.first_name ? 'border-red-500' : ''}`} placeholder="أحمد" />
                              {errors.first_name && <p className="text-red-500 text-md mt-1 font-bold">{errors.first_name}</p>}
                            </div>
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">اسم العائلة</label>
                              <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.input} ${errors.last_name ? 'border-red-500' : ''}`} placeholder="محمود" />
                              {errors.last_name && <p className="text-red-500 text-md mt-1 font-bold">{errors.last_name}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">رقم الهاتف</label>
                              <div dir='rtl' className={`flex flex-row-reverse rounded-xl border transition-all ${theme.input} ${errors.customer_phone ? 'border-red-500' : ''}`}>
                                <div className="relative w-32 border-l border-inherit">
                                  <div onClick={() => { setPhoneDropdownOpen(!phoneDropdownOpen); setPhoneSearch(''); }} className="flex items-center justify-between gap-1 px-3 py-3 h-full cursor-pointer hover:bg-black/10 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-2">
                                      <img src={`https://flagcdn.com/w20/${formData.phone_iso}.png`} alt="flag" className="w-5" />
                                      <span dir='ltr' className="font-bold text-xl">{formData.phone_code}</span>
                                    </div>
                                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                  </div>
                                  {phoneDropdownOpen && (
                                    <>
                                      <div className="fixed inset-0 z-10" onClick={() => setPhoneDropdownOpen(false)}></div>
                                      <div className={`absolute top-full left-0 mt-2 w-56 max-h-64 overflow-hidden rounded-xl shadow-xl z-20 flex flex-col border ${theme.dropdown}`}>
                                        <div className="p-2 border-b border-inherit sticky top-0 z-10 bg-inherit">
                                          <input type="text" value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} placeholder="بحث عن رمز الدولة..." className={`w-full px-3 py-1.5 text-xl rounded-lg outline-none ${theme.input}`} onClick={(e) => e.stopPropagation()} />
                                        </div>
                                        <ul className="overflow-y-auto flex-1 max-h-48 custom-scrollbar">
                                          {processedPhoneCodes.map((pc, idx) => (
                                            <li key={idx} onClick={() => { setFormData(prev => ({ ...prev, phone_code: pc.code, phone_iso: pc.iso })); setPhoneDropdownOpen(false); }} className={`flex items-center px-4 py-2 cursor-pointer transition-colors border-b border-inherit last:border-0 ${theme.dropdownItemHover}`}>
                                              <img src={`https://flagcdn.com/w20/${pc.iso}.png`} alt="" className="w-5 ml-3" />
                                              <span dir='ltr' className="font-medium text-xl">{pc.code}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} className="w-full px-3 py-3 bg-transparent outline-none text-left" placeholder="9X XXX XXXX" dir="ltr" />
                              </div>
                              {errors.customer_phone && <p className="text-red-500 text-md mt-1 font-bold">{errors.customer_phone}</p>}
                            </div>
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">البريد الإلكتروني</label>
                              <input type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} dir='ltr' className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-left ${theme.input} ${errors.customer_email ? 'border-red-500' : ''}`} placeholder="info@silkroadlodge.com" />
                              {errors.customer_email && <p className="text-red-500 text-md mt-1 font-bold">{errors.customer_email}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="relative">
                              <label className="block text-xl font-bold mb-2 opacity-80">الجنس</label>
                              <div onClick={() => setGenderDropdownOpen(!genderDropdownOpen)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border cursor-pointer transition-all ${theme.input}`}>
                                <span className="font-bold">{formData.gender}</span>
                                <svg className={`w-4 h-4 opacity-50 transition-transform ${genderDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                              {genderDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setGenderDropdownOpen(false)}></div>
                                  <div className={`absolute top-full left-0 mt-2 w-full rounded-xl shadow-xl z-20 flex flex-col overflow-hidden border ${theme.dropdown}`}>
                                    <ul className="flex-1">
                                      {['ذكر', 'أنثى'].map(g => (
                                        <li key={g} onClick={() => { setFormData(prev => ({ ...prev, gender: g })); setGenderDropdownOpen(false); }} className={`px-4 py-3 cursor-pointer transition-colors border-b border-inherit last:border-0 font-bold ${formData.gender === g ? 'bg-silk-sand/20 text-silk-sand' : theme.dropdownItemHover}`}>{g}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="relative">
                              <label className="block text-xl font-bold mb-2 opacity-80">الجنسية</label>
                              <div onClick={() => { setNatDropdownOpen(!natDropdownOpen); setNatSearch(''); }} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border cursor-pointer transition-all ${theme.input} ${errors.nationality ? 'border-red-500' : ''}`}>
                                {formData.nationality ? (
                                  <div className="flex items-center gap-2">
                                    <img src={`https://flagcdn.com/w20/${formData.nationality_iso}.png`} alt="flag" className="w-5" />
                                    <span className="font-bold">{formData.nationality_label}</span>
                                  </div>
                                ) : (<span className="font-bold opacity-50">اختر الجنسية</span>)}
                                <svg className={`w-4 h-4 opacity-50 transition-transform ${natDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                              {natDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setNatDropdownOpen(false)}></div>
                                  <div className={`absolute top-full left-0 mt-2 w-full max-h-64 overflow-hidden rounded-xl shadow-xl z-20 flex flex-col border ${theme.dropdown}`}>
                                    <div className="p-2 border-b border-inherit sticky top-0 z-10 bg-inherit">
                                      <input type="text" value={natSearch} onChange={(e) => setNatSearch(e.target.value)} placeholder="بحث..." className={`w-full px-3 py-2 text-xl rounded-lg outline-none ${theme.input}`} onClick={(e) => e.stopPropagation()} />
                                    </div>
                                    <ul className="overflow-y-auto flex-1 max-h-52 custom-scrollbar">
                                      {processedNationalities.map((nat: any) => (
                                        <li key={nat.value} onClick={() => { setFormData(prev => ({ ...prev, nationality: nat.value, nationality_iso: nat.iso?.toLowerCase(), nationality_label: nat.label })); setNatDropdownOpen(false); }} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-inherit last:border-0 font-bold text-xl ${theme.dropdownItemHover}`}>
                                          <img src={`https://flagcdn.com/w20/${nat.iso?.toLowerCase()}.png`} alt="" className="w-5" />
                                          <span>{nat.label}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                              {errors.nationality && <p className="text-red-500 text-md mt-1 font-bold">{errors.nationality}</p>}
                            </div>
                            <div className="relative">
                              <label className="block text-xl font-bold mb-2 opacity-80">العمر</label>
                              <div onClick={() => setAgeDropdownOpen(!ageDropdownOpen)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border cursor-pointer transition-all ${theme.input} ${errors.age ? 'border-red-500' : ''}`}>
                                <span className={`font-bold ${formData.age ? '' : 'opacity-50'}`}>{formData.age ? formData.age : 'العمر'}</span>
                                <svg className={`w-4 h-4 opacity-50 transition-transform ${ageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                              {ageDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setAgeDropdownOpen(false)}></div>
                                  <div className={`absolute top-full left-0 mt-2 w-full max-h-64 overflow-hidden rounded-xl shadow-xl z-20 flex flex-col border ${theme.dropdown}`}>
                                    <ul className="overflow-y-auto flex-1 max-h-52 custom-scrollbar">
                                      {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                        <li key={num} onClick={() => { setFormData(prev => ({ ...prev, age: num.toString() })); setErrors(prev => ({ ...prev, age: '' })); setAgeDropdownOpen(false); }} className={`px-4 py-2 cursor-pointer transition-colors border-b border-inherit last:border-0 font-bold text-center ${formData.age === num.toString() ? 'bg-silk-sand/20 text-silk-sand' : theme.dropdownItemHover}`}>{num}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                              {errors.age && <p className="text-red-500 text-md mt-1 font-bold">{errors.age}</p>}
                            </div>
                          </div>

                          <div className="pt-6 border-t border-inherit flex justify-end">
                            <button type="submit" className="px-8 py-3 bg-silk-sand text-silk-dark text-xl cursor-pointer font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">التالي</button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">تاريخ الوصول</label>
                              <input type="date" name="check_in" value={formData.check_in} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-bold ${theme.input} ${errors.check_in ? 'border-red-500' : ''}`} />
                              {errors.check_in && <p className="text-red-500 text-md mt-1 font-bold">{errors.check_in}</p>}
                            </div>
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">تاريخ المغادرة</label>
                              <input type="date" name="check_out" value={formData.check_out} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-bold ${theme.input} ${errors.check_out ? 'border-red-500' : ''}`} />
                              {errors.check_out && <p className="text-red-500 text-md mt-1 font-bold">{errors.check_out}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">عدد النزلاء</label>
                              <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border transition-all ${theme.input} ${errors.guests_count ? 'border-red-500' : ''}`}>
                                <button type="button" onClick={() => handleCounterChange('guests_count', false, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 font-bold text-xl transition-colors">-</button>
                                <span className="font-bold text-lg w-8 text-center">{formData.guests_count}</span>
                                <button type="button" onClick={() => handleCounterChange('guests_count', true, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand text-silk-dark font-bold text-xl transition-colors">+</button>
                              </div>
                              {errors.guests_count && <p className="text-red-500 text-md mt-1 font-bold">{errors.guests_count}</p>}
                            </div>
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">عدد الغرف</label>
                              <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border transition-all ${theme.input} ${errors.rooms_count ? 'border-red-500' : ''}`}>
                                <button type="button" onClick={() => handleCounterChange('rooms_count', false, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 font-bold text-xl transition-colors">-</button>
                                <span className="font-bold text-lg w-8 text-center">{formData.rooms_count}</span>
                                <button type="button" onClick={() => handleCounterChange('rooms_count', true, 1, hasFetchedResources ? availableResources.rooms : undefined)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand text-silk-dark font-bold text-xl transition-colors">+</button>
                              </div>
                              {errors.rooms_count && <p className="text-red-500 text-md mt-1 font-bold">{errors.rooms_count}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">أسرّة مفردة</label>
                              <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border transition-all ${theme.input} ${errors.single_beds_count ? 'border-red-500' : ''}`}>
                                <button type="button" onClick={() => handleCounterChange('single_beds_count', false, 0)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 font-bold text-xl transition-colors">-</button>
                                <span className="font-bold text-lg w-8 text-center">{formData.single_beds_count}</span>
                                <button type="button" onClick={() => handleCounterChange('single_beds_count', true, 0, hasFetchedResources ? availableResources.singles : undefined)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand text-silk-dark font-bold text-xl transition-colors">+</button>
                              </div>
                              {errors.single_beds_count && <p className="text-red-500 text-md mt-1 font-bold">{errors.single_beds_count}</p>}
                            </div>
                            <div>
                              <label className="block text-xl font-bold mb-2 opacity-80">أسرّة مزدوجة</label>
                              <div dir='ltr' className={`flex items-center justify-between w-full px-4 py-2 rounded-xl border transition-all ${theme.input} ${errors.double_beds_count ? 'border-red-500' : ''}`}>
                                <button type="button" onClick={() => handleCounterChange('double_beds_count', false, 0)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 font-bold text-xl transition-colors">-</button>
                                <span className="font-bold text-lg w-8 text-center">{formData.double_beds_count}</span>
                                <button type="button" onClick={() => handleCounterChange('double_beds_count', true, 0, hasFetchedResources ? availableResources.doubles : undefined)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-silk-sand text-silk-dark font-bold text-xl transition-colors">+</button>
                              </div>
                              {errors.double_beds_count && <p className="text-red-500 text-md mt-1 font-bold">{errors.double_beds_count}</p>}
                            </div>
                          </div>

                          {errors.combination && (
                            <p className="text-red-500 text-xl mt-3 font-bold flex items-center gap-1">
                              <Icons.Check /> {errors.combination}
                            </p>
                          )}

                          <div className="pt-2">
                            <label className="block text-xl font-bold mb-3 opacity-80">خدمات إضافية</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {availableServices.map(service => (
                                <label key={service.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.requested_services.includes(service.id) ? 'border-silk-sand bg-silk-sand/10 font-bold' : `border-inherit ${theme.dropdownItemHover}`}`}>
                                  <input type="checkbox" checked={formData.requested_services.includes(service.id)} onChange={() => handleCheckboxChange(service.id)} className="w-4 h-4 accent-silk-sand rounded" />
                                  <span className="text-xl font-medium">{service.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xl font-bold mb-2 opacity-80">ملاحظات خاصة</label>
                            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${theme.input}`} placeholder="أضف أي ملاحظات أو طلبات خاصة هنا..." />
                          </div>

                          {serverError && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xl font-bold">{serverError}</div>}

                          <div className="pt-6 border-t border-inherit flex justify-between items-center gap-4">
                            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border  text-xl cursor-pointer border-inherit opacity-70 hover:opacity-100 font-bold rounded-xl transition-all">السابق</button>
                            <button type="submit" disabled={isLoading || isCheckingResources} className="text-xl cursor-pointer flex-1 max-w-xs py-3 bg-silk-sand text-silk-dark font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">
                              {isLoading ? 'جاري التسجيل...' : 'تأكيد وتسجيل الحجز'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}