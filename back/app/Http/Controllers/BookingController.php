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
        // تم إزالة with('rooms') لأننا لم نعد نعتمد على الربط
        $bookings = Booking::latest()->get();
        return response()->json(['success' => true, 'data' => $bookings], 200);
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

        // 🌟 الفحص الرياضي الذكي (مطابق تماماً لما تراه واجهة React)
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

        // جدار الحماية: إذا كان الطلب أكبر من الموارد المتاحة
        if ($request->rooms_count > $availableRooms ||
            $request->double_beds_count > $availableDoubles ||
            $request->single_beds_count > $availableSingles) {

            return response()->json([
                'success' => false,
                'message' => __('messages.room_already_booked') ?? 'عذراً، الموارد المتبقية لا تكفي لتلبية هذا الطلب.'
            ], 422);
        }

        // الحفظ المباشر في قاعدة البيانات (بدون أي ربط بجداول أخرى)
        $validatedData['status'] = 'confirmed';
        $booking = Booking::create($validatedData);

        // إرسال الإيميلات
        try {
            \Illuminate\Support\Facades\Mail::to($booking->customer_email)->send(new \App\Mail\BookingConfirmed($booking));
            $adminEmail = 'saraals6216@gmail.com';
            \Illuminate\Support\Facades\Mail::to($adminEmail)->send((new \App\Mail\AdminNewBookingMail($booking))->locale('ar'));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('فشل إرسال إيميلات الحجز: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => __('messages.booking_created'),
            'data' => $booking
        ], 201);
    }
    // /**
    //  * إنشاء حجز جديد
    //  */
    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'customer_name'      => 'required|string|max:255',
    //         'customer_phone'     => 'required|string|max:20',
    //         'customer_email'     => 'required|email|max:255',
    //         'gender'             => 'required|in:male,female,other',
    //         'nationality'        => 'required|string|max:100',
    //         'age'                => 'required|integer|min:18',
    //         'guests_count'       => 'required|integer|min:1',
    //         'rooms_count'        => 'required|integer|min:1',
    //         'double_beds_count'  => 'required|integer|min:0',
    //         'single_beds_count'  => 'required|integer|min:0',
    //         'booked_room_names'  => 'required|string|max:1000',
    //         'check_in'           => 'required|date|after_or_equal:today',
    //         'check_out'          => 'required|date|after:check_in',
    //         'requested_services' => 'nullable|array',
    //         'notes'              => 'nullable|string|max:1000',
    //     ]);

    //     // 🌟 الفحص الذكي والمطابق 100% للواجهة (بالعمليات الحسابية)
    //     $overlappingBookings = Booking::where('status', 'confirmed')
    //         ->where('check_in', '<', $request->check_out)
    //         ->where('check_out', '>', $request->check_in)
    //         ->get();

    //     $usedRooms = $overlappingBookings->sum('rooms_count');
    //     $usedDoubles = $overlappingBookings->sum('double_beds_count');
    //     $usedSingles = $overlappingBookings->sum('single_beds_count');

    //     $availableRooms = max(0, 8 - $usedRooms);
    //     $availableDoubles = max(0, 8 - $usedDoubles);
    //     $availableSingles = max(0, 10 - $usedSingles);

    //     // إذا كان الطلب يتجاوز السعة المتبقية
    //     if ($request->rooms_count > $availableRooms ||
    //         $request->double_beds_count > $availableDoubles ||
    //         $request->single_beds_count > $availableSingles) {

    //         return response()->json([
    //             'success' => false,
    //             'message' => __('messages.room_already_booked') ?? 'عذراً، الموارد المتبقية لا تكفي لتلبية هذا الطلب.'
    //         ], 422);
    //     }

    //     // الحفظ في قاعدة البيانات
    //     $validatedData['status'] = 'confirmed';
    //     $booking = Booking::create($validatedData);

    //     // إرسال الإيميلات
    //     try {
    //         Mail::to($booking->customer_email)->send(new BookingConfirmed($booking));
    //         $adminEmail = 'saraals6216@gmail.com';
    //         Mail::to($adminEmail)->send((new AdminNewBookingMail($booking))->locale('ar'));
    //     } catch (\Exception $e) {
    //         Log::error('فشل إرسال إيميلات الحجز: ' . $e->getMessage());
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => __('messages.booking_created'),
    //         'data' => $booking
    //     ], 201);
    // }

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
     * حذف حجز
     */
    public function destroy(string $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => __('messages.booking_not_found')], 404);
        }
        $booking->delete();
        return response()->json(['success' => true, 'message' => __('messages.booking_deleted')], 200);
    }
}
