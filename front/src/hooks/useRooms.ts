// src/hooks/useRooms.js
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // 👈 1. استيراد الدالة الجديدة هنا
import api from '../api/apiConfig';
import { useTranslation } from 'react-i18next';

const fetchRooms = async () => {
    const response = await api.get('/rooms');
    return response.data;
};

export const useRooms = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    return useQuery({
        queryKey: ['rooms', currentLanguage],
        queryFn: fetchRooms,
        // 👈 2. التصحيح المتوافق مع الإصدار الخامس لمنع وميض الشاشة الأبيض عند تغيير اللغة
        placeholderData: keepPreviousData,
    });
};