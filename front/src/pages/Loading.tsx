import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-silk-cream">
            {/* الشعار أو رمز الفندق */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="text-center"
            >
                {/* يمكنك استبدال هذا بنص أو أيقونة SVG */}
                {/* <h1 className="font-english text-4xl text-silk-brown mb-2 tracking-[0.2em]">
                    SILK ROAD
                </h1> */}
                <img src="/logo.png" alt="" className='w-[400px] h-[400px]'/>
                <div className="w-16 h-[1px] bg-silk-sand mx-auto"></div>
            </motion.div>
        </div>
    );
}