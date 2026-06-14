<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;
use App\Models\Booking;
use Carbon\Carbon;

class Room extends Model implements HasMedia
{
    use InteractsWithMedia, HasTranslations;

    // 1. إزالة booking_status من هنا لأنها قيمة ديناميكية حاسوبية
    protected $fillable = ['name', 'description', 'guests', 'beds', 'price'];

    // 2. إخبار لارافيل بالحقول التي سيتم ترجمتها تلقائياً
    public array $translatable = ['name', 'description'];

    // 3. دمج الحقلين الديناميكيين ليظهرا في الـ API تلقائياً
    protected $appends = ['image_url', 'booking_status','blocked_dates'];

    /**
     * علاقة الغرفة مع الحجوزات
     */
        // 1. تحديث الـ appends
    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_room');
    }
    /**
     * 🌟 جلب جميع الفترات المحجوزة للغرفة ليتم تعطيلها في تقويم العميل
     */
    public function getBlockedDatesAttribute(): array
    {
        // نعتمد على العلاقة المحملة مسبقاً (Eager Loaded) لتسريع الأداء
        return $this->bookings->map(function ($booking) {
            return [
                // تاريخ بداية الحجز
                'start' => $booking->check_in,
                // تاريخ الخروج ناقص يوم (لأن يوم الخروج يعتبر متاحاً لحجز جديد يمر بنفس اليوم)
                'end'   => \Carbon\Carbon::parse($booking->check_out)->subDay()->format('Y-m-d'),
            ];
        })->values()->toArray();
    }
    /**
     * 🌟 جلب حالة الحجز الحالية ديناميكياً مع حساب التواريخ المتداخلة
     */
    public function getBookingStatusAttribute(): array
    {
        $today = Carbon::today();

        // 🌟 استخدام العلاقة المحملة مسبقاً لتجنب الاستعلامات المتكررة
        $bookings = $this->bookings;

        $is_booked = false;
        $checkDate = $today->copy();

        // فحص هل الغرفة محجوزة "اليوم"
        foreach($bookings as $booking) {
            $start = Carbon::parse($booking->check_in)->startOfDay();
            $end = Carbon::parse($booking->check_out)->startOfDay();

            if ($today->betweenIncluded($start, $end->copy()->subDay())) {
                $is_booked = true;
                break; // الغرفة محجوزة اليوم، نوقف الفحص
            }
        }

        // إذا لم تكن محجوزة "اليوم" بالتحديد، فهي متاحة الآن
        if (!$is_booked) {
            return [
                'is_booked'    => false,
                'available_at' => null, // متاحة من اليوم
            ];
        }

        // البحث عن أقرب تاريخ متاح بعد اليوم
        while (true) {
            $conflict = false;

            foreach ($bookings as $booking) {
                $start = Carbon::parse($booking->check_in)->startOfDay();
                $end = Carbon::parse($booking->check_out)->startOfDay();

                if ($checkDate->betweenIncluded($start, $end->copy()->subDay())) {
                    $conflict = true;
                    $checkDate = $end->copy(); // اقفز لتاريخ الخروج
                    break;
                }
            }

            if (!$conflict) {
                break;
            }
        }

        return [
            'is_booked'    => true,
            'available_at' => $checkDate->format('Y-m-d'),
        ];
    }

    /**
     * جلب رابط الصورة
     */
    public function getImageUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('images') ?: 'https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel';
    }
}
