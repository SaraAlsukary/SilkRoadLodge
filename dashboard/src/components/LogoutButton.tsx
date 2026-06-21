import { useAuth } from '../hooks/useAuth';

export default function LogoutButton() {
    const { logout, isLoggingOut } = useAuth();

    return (
        <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className={`flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-lg font-arabic font-semibold transition-all duration-300 border-2
        ${isLoggingOut
                    ? 'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-transparent border-silk-brown text-silk-brown hover:bg-silk-brown hover:text-white hover:shadow-md active:scale-95'}`}
        >
            {/* أيقونة خروج بسيطة من SVG */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>

            {isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}
        </button>
    );
}