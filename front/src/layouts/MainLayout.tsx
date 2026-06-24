import { Outlet, ScrollRestoration } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import FloatingSocials from "../components/FloatingSocials"

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet/>
            <Footer />
            {/* زر التواصل العائم يوضع هنا ليبقى فوق كل شيء */}
            <FloatingSocials />
            <ScrollRestoration />
        </>
    )
}

export default MainLayout