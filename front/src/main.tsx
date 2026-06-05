import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n.ts'
import AppRouter from './router/AppRouter.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// إنشاء نسخة من الـ Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // لمنع إعادة الاستدعاء التلقائي بمجرد الانتقال بين نوافذ المتصفح
      retry: 1, // عدد محاولات إعادة الطلب عند الفشل
    },
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </StrictMode>,
)
