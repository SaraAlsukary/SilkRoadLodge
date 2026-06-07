<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * عرض قائمة بجميع الحجوزات
     */
    public function index()
    {
        $bookings = Booking::with('room')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $bookings
        ], 200);
    }

    /**
     * جلب تواريخ الحجوزات الحالية والمستقبلية لغرفة معينة (مفيد للتقويم في الواجهة)
     */
    public function getBookedDates($roomId) {
        $bookings = Booking::where('room_id', $roomId)
            ->where('status', 'confirmed')
            ->where('check_out', '>=', now()->toDateString())
            ->get(['check_in', 'check_out']);

        return response()->json($bookings);
    }

    /**
     * إنشاء حجز جديد مع فحص التداخل الديناميكي
     */
    public function store(Request $request)
    {
        // ملاحظة: يُفضل نقل الـ Validation إلى FormRequest منفصل مستقبلاً لتنظيف الـ Controller
        $validatedData = $request->validate([
            'room_id'            => 'required|exists:rooms,id',
            'customer_name'      => 'required|string|max:255',
            'customer_phone'     => 'required|string|max:20',
            'customer_email'     => 'required|email|max:255',
            'gender'             => 'required|in:male,female,other',
            'nationality'        => 'required|string|max:100',
            'age'                => 'required|integer|min:18',
            'guests_count'       => 'required|integer|min:1',
            'check_in'           => 'required|date|after_or_equal:today',
            'check_out'          => 'required|date|after:check_in',
            'requested_services' => 'nullable|array',
            'notes'              => 'nullable|string|max:1000',
        ]);

        // الفحص الذكي للتداخل الزمني
        $isRoomOccupied = Booking::where('room_id', $request->room_id)
            ->where('status', 'confirmed')
            ->where('check_in', '<', $request->check_out)
            ->where('check_out', '>', $request->check_in)
            ->exists();

        if ($isRoomOccupied) {
            return response()->json([
                'success' => false,
                'message' => __('messages.room_already_booked') // 🌟 التغيير هنا
            ], 422);
        }

        $validatedData['status'] = 'confirmed';
        $booking = Booking::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => __('messages.booking_created'), // 🌟 التغيير هنا
            'data' => $booking->load('room')
        ], 201);
    }

    /**
     * عرض تفاصيل حجز معين
     */
    public function show(string $id)
    {
        $booking = Booking::with('room')->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => __('messages.booking_not_found') // 🌟 التغيير هنا
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ], 200);
    }

    /**
     * تحديث بيانات الحجز
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => __('messages.booking_not_found') // 🌟 التغيير هنا
            ], 404);
        }

        $validatedData = $request->validate([
            'customer_name'  => 'sometimes|required|string|max:255',
            'customer_phone' => 'sometimes|required|string|max:20',
            'customer_email' => 'sometimes|required|email|max:255',
            'guests_count'   => 'sometimes|required|integer|min:1',
            'status'         => 'sometimes|required|in:confirmed,cancelled,completed',
            'notes'          => 'nullable|string|max:1000',
        ]);

        $booking->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => __('messages.booking_updated'), // 🌟 التغيير هنا
            'data' => $booking
        ], 200);
    }

    /**
     * حذف الحجز
     */
    public function destroy(string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => __('messages.booking_not_found') // 🌟 التغيير هنا
            ], 404);
        }

        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => __('messages.booking_deleted') // 🌟 التغيير هنا
        ], 200);
    }
}
