import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../hooks/useBooking';
import { useAuth } from '../hooks/useAuth';
import LogoutButton from '../components/LogoutButton';
import { Icons, sidebarNavigation, getTheme } from '../constants/admin';
import BookingsList from '../components/BookingList';
import AddBookingForm from '../components/AddBookingForm';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('list');
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoading: loadingUser, user, isError } = useAuth();
  const { createBooking, isLoading, error: serverError, bookings: apiBookings, fetchAllBookings, updateBooking, deleteBooking, cancelBooking } = useBooking();

  const theme = getTheme(isDarkMode);

  // جلب الصفحة الأولى تلقائياً عند فتح سجل الحجوزات
  useEffect(() => {
    if (activeSidebarItem === 'list') {
      fetchAllBookings(1);
    }
  }, [activeSidebarItem, fetchAllBookings]);

  const handleBookingSuccess = () => {
    setShowSuccess(true);
    fetchAllBookings(1);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveSidebarItem('list');
    }, 1500);
  };

  // تأثير للصعود التلقائي لأعلى الشاشة فور نجاح العملية
  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showSuccess]);

  const getPageTitle = () => sidebarNavigation.find(nav => nav.id === activeSidebarItem)?.name || 'لوحة التحكم';

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme.bg}`} dir="rtl">
      <style>{`
        .custom-table-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-table-scrollbar::-webkit-scrollbar-track { background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; border-radius: 8px; margin: 0 16px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 8px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #b5952f; }
      `}</style>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
            <Icons.Check /> تم إضافة الحجز بنجاح
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 right-0 z-50 w-72 transform transition-transform duration-300 border-l ${theme.sidebar} lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-inherit">
          <h2 className="text-2xl font-black text-silk-sand tracking-tighter font-sans">SILK ROAD LODGE</h2>
          <p className="text-[10px] uppercase tracking-[4px] opacity-40 mt-1 font-sans">Dashboard Hotel Management</p>
        </div>
        <nav className="p-6 space-y-3">
          {sidebarNavigation.map(item => (
            <button key={item.id} onClick={() => { setActiveSidebarItem(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center cursor-pointer gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-xl ${activeSidebarItem === item.id ? 'bg-silk-sand text-silk-dark font-bold shadow-lg shadow-silk-sand/20' : `opacity-60 hover:opacity-100 hover:bg-silk-sand/10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}`}>
              <item.icon />
              <span className={activeSidebarItem === item.id ? "font-bold" : "font-medium"}>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 pt-60 lg:pt-30 border-b border-inherit">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className={`h-24 sticky top-0 z-30 border-b backdrop-blur-xl ${theme.header} flex items-center justify-between px-8`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden cursor-pointer p-3 bg-white/5 rounded-xl"><Icons.Menu /></button>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 cursor-pointer rounded-xl transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <div className="h-10 w-[1px] bg-silk-sand/20" />
            {isError ? "حصل خطأ بجلب معلومات الأدمن" : loadingUser ? "Loading..." : <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block ">
                <p className="text-xl font-bold">{user?.name}</p>
                <p className="text-md opacity-50">{user?.email}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-silk-sand text-silk-dark flex items-center justify-center font-black text-2xl lg:text-4xl">S</div>
            </div>}
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {activeSidebarItem === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-20 opacity-50">
                <Icons.Home />
                <h2 className="mt-4 text-xl font-bold">مرحباً بك في لوحة تحكم فندق طريق الحرير</h2>
                <p className="text-xl mt-2">اختر "سجل الحجوزات" أو "إضافة حجز" من القائمة الجانبية</p>
              </motion.div>
            )}

            {activeSidebarItem === 'list' && (
              <BookingsList
                key="list"
                apiData={apiBookings}
                onPageChange={(newPage) => fetchAllBookings(newPage)}
                theme={theme}
                updateBooking={updateBooking}
                deleteBooking={deleteBooking}
                cancelBooking={cancelBooking}
                isLoading={isLoading}
              />
            )}

            {activeSidebarItem === 'add' && (
              <AddBookingForm key="add" theme={theme} createBooking={createBooking} isLoading={isLoading} serverError={serverError} onSuccess={handleBookingSuccess} />
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}