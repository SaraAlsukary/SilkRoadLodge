import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import Loading from '../pages/Loading';
import { useTranslation } from 'react-i18next';

const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const About = lazy(() => import('../pages/About'));
const RoomTypes = lazy(() => import('../pages/Rooms'));
const Services = lazy(() => import('../pages/Services'));
const Booking = lazy(() => import('../pages/Booking'));

const Loader = <P extends object>(Component: ComponentType<P>) => {
    return (props: P) => (
        <Suspense fallback={<Loading />}>
            <Component {...props} />
        </Suspense>
    );
};

const HomeLazy = Loader(Home);
const AboutLazy = Loader(About);
const NotFoundLazy = Loader(NotFound);
const ServicesLazy = Loader(Services);
const RoomTypeLazy = Loader(RoomTypes);
const BookingLazy = Loader(Booking);

const App = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const currentLang = i18n.language;
        document.body.dir = currentLang === "ar" ? "rtl" : "ltr";

        // إزالة الكلاسات السابقة لتجنب تداخل الخطوط
        document.body.classList.remove("font-arabic", "font-english", "font-japanese");

        // استخدام includes بدلاً من الشروط الخاطئة
        if (currentLang === "ar") {
            document.body.classList.add("font-arabic");
        } else if (['en', 'es', 'fr'].includes(currentLang)) {
            document.body.classList.add("font-english");
        } else if (['ja', 'zh'].includes(currentLang)) {
            document.body.classList.add("font-japanese");
        }

    }, [i18n.language]);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { index: true, element: <HomeLazy /> },
                { path: 'about', element: <AboutLazy /> },
                { path: 'rooms', element: <RoomTypeLazy /> },
                { path: 'booking', element: <BookingLazy /> },
                { path: 'contact' },
                { path: 'services', element: <ServicesLazy /> },
                { path: '*', element: <NotFoundLazy /> },
            ],
        }
    ]);

    return (
        <RouterProvider router={router} />
    );
}

export default App;