<?php

namespace App\Http\Controllers;

use App\Mail\BookingConfirmed;
use App\Mail\AdminNewBookingMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    /**
     * عرض جميع الحجوزات
     */
        public function index()
        {
            // استخدام paginate(10) بدلاً من get() لجلب 10 حجوزات لكل صفحة
            $bookings = Booking::latest()->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $bookings
            ], 200);
        }

    /**
     * فحص الموارد المتاحة (الغرف، الأسرة المزدوجة، الأسرة المفردة) للواجهة
     */
    public function checkResources(Request $request)
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
        ]);

        $overlappingBookings = Booking::where('status', 'confirmed')
            ->where('check_in', '<', $request->check_out)
            ->where('check_out', '>', $request->check_in)
            ->get();

        $usedRooms = $overlappingBookings->sum('rooms_count');
        $usedDoubles = $overlappingBookings->sum('double_beds_count');
        $usedSingles = $overlappingBookings->sum('single_beds_count');

        return response()->json([
            'available_rooms' => max(0, 8 - $usedRooms),
            'available_doubles' => max(0, 8 - $usedDoubles),
            'available_singles' => max(0, 10 - $usedSingles),
        ]);
    }
    /**
     * إرسال وإنشاء حجز جديد
     */

        public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_name'      => 'required|string|max:255',
            'customer_phone'     => 'required|string|max:20',
            'customer_email'     => 'required|email|max:255',
            'gender'             => 'required|in:male,female,other',
            'nationality'        => 'required|string|max:100',
            'age'                => 'required|integer',
            'guests_count'       => 'required|integer|min:1',
            'rooms_count'        => 'required|integer|min:1',
            'double_beds_count'  => 'required|integer|min:0',
            'single_beds_count'  => 'required|integer|min:0',
            'booked_room_names'  => 'required|string|max:1000',
            'check_in'           => 'required|date|after_or_equal:today',
            'check_out'          => 'required|date|after:check_in',
            'requested_services' => 'nullable|array',
            'notes'              => 'nullable|string|max:1000',
        ]);

        // 🌟 الفحص الرياضي الذكي
        $overlappingBookings = Booking::where('status', 'confirmed')
            ->where('check_in', '<', $request->check_out)
            ->where('check_out', '>', $request->check_in)
            ->get();

        $usedRooms = $overlappingBookings->sum('rooms_count');
        $usedDoubles = $overlappingBookings->sum('double_beds_count');
        $usedSingles = $overlappingBookings->sum('single_beds_count');

        // السعة القصوى للفندق
        $availableRooms = max(0, 8 - $usedRooms);
        $availableDoubles = max(0, 8 - $usedDoubles);
        $availableSingles = max(0, 10 - $usedSingles);

        // جدار الحماية
        if ($request->rooms_count > $availableRooms ||
            $request->double_beds_count > $availableDoubles ||
            $request->single_beds_count > $availableSingles) {

            return response()->json([
                'success' => false,
                'message' => __('messages.room_already_booked') ?? 'عذراً، الموارد المتبقية لا تكفي لتلبية هذا الطلب.'
            ], 422);
        }

        // الحفظ المباشر في قاعدة البيانات
        $validatedData['status'] = 'confirmed';
        $booking = Booking::create($validatedData);

        // 🌟 فحص ما إذا كان المستخدم الحالي مسجل دخوله وله دور (role) يساوي 'admin'
        // 🌟 التعديل هنا: إضافة ('sanctum') داخل دالة auth
        $isAdmin = auth('sanctum')->check() && auth('sanctum')->user()->role === 'admin';
        // يتم إرسال الإيميلات فقط إذا لم يكن المستخدم "أدمن" (أي عميل عادي يحجز من الموقع)
        if (!$isAdmin) {
            try {
                \Illuminate\Support\Facades\Mail::to($booking->customer_email)->send(new \App\Mail\BookingConfirmed($booking));
                // $adminEmail = 'saraals6216@gmail.com';
                $adminEmail = 'info@silkroadlodge.com';
                \Illuminate\Support\Facades\Mail::to($adminEmail)->send((new \App\Mail\AdminNewBookingMail($booking))->locale('ar'));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('فشل إرسال إيميلات الحجز: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => __('messages.booking_created'),
            'data' => $booking
        ], 201);
    }

    /**
     * عرض تفاصيل حجز
     */
    public function show(string $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => __('messages.booking_not_found')], 404);
        }
        return response()->json(['success' => true, 'data' => $booking], 200);
    }

    /**
     * تحديث حجز
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => __('messages.booking_not_found')], 404);
        }

        $validatedData = $request->validate([
            'status' => 'sometimes|required|in:confirmed,cancelled,completed',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $booking->update($validatedData);
        return response()->json(['success' => true, 'data' => $booking], 200);
    }
    /**
     * حذف حجز نهائياً (بشرط أن يكون ملغياً فقط)
     */
    public function destroy(string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['success' => false, 'message' => __('messages.booking_not_found')], 404);
        }

        // الجدار الناري: منع الحذف إذا لم يكن الحجز ملغياً
        if ($booking->status !== 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف الحجز نهائياً لأنه لم يتم إلغاؤه بعد. الرجاء إلغاء الحجز أولاً.'
            ], 403);
        }

        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الحجز الملغى نهائياً من النظام.'
        ], 200);
    }
    /**
     * حذف جميع الحجوزات الملغاة دفعة واحدة (تنظيف النظام)
     */
    public function destroyAllCancelled()
    {
        $deletedCount = Booking::where('status', 'cancelled')->delete();

        if ($deletedCount === 0) {
            return response()->json(['success' => false, 'message' => 'لا توجد حجوزات ملغاة لحذفها.'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "تم تنظيف النظام وحذف {$deletedCount} حجوزات ملغاة نهائياً."
        ], 200);
    }
    /**
     * حذف حجز
     */


    /**
     * استنتاج لغة العميل بناءً على حقل الجنسية أو البلد
     */
    private function getLocaleFromNationality(string $nationality): string
    {
        // تحويل النص لحروف صغيرة لتسهيل البحث
        $nationality = strtolower($nationality);

        // قواميس الكلمات المفتاحية لكل لغة
        $locales = [
            'ar' => ['saudi', 'egypt', 'uae', 'emirates', 'jordan', 'syria', 'lebanon', 'morocco', 'iraq', 'yemen', 'oman', 'kuwait', 'qatar', 'bahrain', 'palestine', 'sudan', 'algeria', 'tunisia', 'libya', 'سعودي', 'مصر', 'امارات', 'عراق', 'مغرب'],
            'fr' => ['france', 'french', 'belgium', 'canada', 'senegal', 'mali', 'cameroon', 'suisse', 'swiss'],
            'es' => ['spain', 'mexico', 'argentina', 'colombia', 'peru', 'chile', 'venezuela', 'ecuador', 'guatemala', 'cuba', 'bolivia', 'paraguay', 'uruguay'],
            'ja' => ['japan', 'japanese', 'اليابان'],
            'de' => ['germany', 'german', 'austria', 'switzerland', 'ألمانيا', 'المانيا'],
            'zh' => ['china', 'chinese', 'taiwan', 'hong kong', 'macau', 'الصين']
        ];

        // البحث في القواميس
        foreach ($locales as $lang => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($nationality, $keyword)) {
                    return $lang;
                }
            }
        }

        // اللغة الافتراضية إذا لم يتم العثور على تطابق
        return 'en';
    }

    public function cancelBooking(string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['success' => false, 'message' => __('messages.booking_not_found')], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['success' => false, 'message' => 'هذا الحجز ملغى مسبقاً.'], 400);
        }

        // تحديث الحالة فقط لإتاحة الموارد
        $booking->update(['status' => 'cancelled']);

        // 🌟 استنتاج اللغة وإرسال الإيميل
        $lang = $this->getLocaleFromNationality($booking->nationality);

        try {
            \Illuminate\Support\Facades\Mail::to($booking->customer_email)
                ->locale($lang) // إجبار الإيميل على استخدام هذه اللغة
                ->send(new \App\Mail\BookingCancelledMail($booking));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('فشل إرسال إيميل الإلغاء: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'تم إلغاء الحجز بنجاح وإرسال بريد إلكتروني للعميل.',
            'data' => $booking
        ], 200);
    }
}
