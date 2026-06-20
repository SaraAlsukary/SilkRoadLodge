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
const Dashboard = lazy(() => import('../pages/Dashboard'));

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
const DashboardLazy = Loader(Dashboard);

// في الراوتر:
const App = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const currentLang = i18n.language;
        document.body.dir = currentLang === "ar" ? "rtl" : "ltr";

        document.body.classList.remove("font-arabic", "font-english", "font-japanese");

        if (currentLang === "ar") {
            document.body.classList.add("font-arabic");
        } else if (currentLang === "en" || "ja" || "es" || "fr") {
            document.body.classList.add("font-english");
        } else if (currentLang === 'ja' || "zh") {
            document.body.classList.add("font-japanese");
        }

    }, [i18n.language]);
    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainLayout />,
            // الصفحات التي ستعرض داخل الـ Layout
            children: [
                {
                    index: true, // المسار الرئيسي الافتراضي (/)
                    element: <HomeLazy />

                },
                {
                    path: 'about', // مسار صفحة حولنا (/about)
                    element: <AboutLazy />,
                },
                {
                    path: 'rooms', // مسار صفحة الغرف (/rooms)
                    element: <RoomTypeLazy />,
                }, {
                    path: 'booking',
                    element: <BookingLazy />
                },
                {
                    path: 'contact', // مسار صفحة اتصل بنا (/contact)
                    // element: <Contact />,
                },
                {
                    path: 'services',
                    element: <ServicesLazy />
                },
                
                {
                    path: '*', // أي مسار لا يطابق المسارات السابقة
                    element: <NotFoundLazy />,
                },

            ],
       
        },
        {
            path: '/manage-system-24',
            element: <DashboardLazy />
        }
    ]);
    return (
        <RouterProvider router={router} />

    );
}
export default App;