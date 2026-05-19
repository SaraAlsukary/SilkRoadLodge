import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { lazy, Suspense, type ComponentType } from 'react';
import Loading from '../pages/Loading';

const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const About = lazy(() => import('../pages/About'));
const Rooms = lazy(() => import('../pages/Rooms'));

const Loader = <P extends object>(Component: ComponentType<P>) => {
    return (props: P) => (
        <Suspense fallback={<Loading />}>
            <Component {...props} />
        </Suspense>
    );
};
const HomeLazy = Loader(Home);
const AboutLazy = Loader(About);
const RoomsLazy = Loader(Rooms);

// في الراوتر:
const App = () => {
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
                    element: <RoomsLazy />,
                },
                {
                    path: 'contact', // مسار صفحة اتصل بنا (/contact)
                    // element: <Contact />,
                },
                {
                    path: '*', // أي مسار لا يطابق المسارات السابقة
                    element: <NotFound />,
                },
            ],
        },
    ]);
    return (
        <RouterProvider router={router} />

    );
}
export default App;