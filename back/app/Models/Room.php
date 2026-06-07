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
    protected $appends = ['image_url', 'booking_status'];

    /**
     * علاقة الغرفة مع الحجوزات
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * 🌟 جلب حالة الحجز الحالية ديناميكياً مع حساب التواريخ المتداخلة
     */
    public function getBookingStatusAttribute(): array
    {
        $today = Carbon::today();

        // 1. جلب جميع الحجوزات المؤكدة القادمة لهذه الغرفة مرتبة حسب تاريخ الدخول
        $bookings = $this->bookings()
            ->where('status', 'confirmed')
            ->where('check_out', '>', $today->format('Y-m-d'))
            ->orderBy('check_in')
            ->get();

        $is_booked = false;
        $checkDate = $today->copy();

        // 2. فحص هل الغرفة محجوزة "اليوم"؟
        foreach($bookings as $booking) {
            $start = Carbon::parse($booking->check_in)->startOfDay();
            $end = Carbon::parse($booking->check_out)->startOfDay();

            // نستخدم subDay لأن يوم الخروج يعتبر متاحاً للحجز الجديد
            if ($today->betweenIncluded($start, $end->copy()->subDay())) {
                $is_booked = true;
                break;
            }
        }

        // إذا لم تكن محجوزة اليوم، لا داعي للبحث عن تاريخ قادم
        if (!$is_booked) {
            return [
                'is_booked' => false,
                'available_at' => null,
            ];
        }

        // 3. البحث الذكي عن أقرب تاريخ متاح فعلياً (يتخطى الحجوزات المتتالية)
        while (true) {
            $conflict = false;

            foreach ($bookings as $booking) {
                $start = Carbon::parse($booking->check_in)->startOfDay();
                $end = Carbon::parse($booking->check_out)->startOfDay();

                // إذا كان التاريخ الذي نفحصه حالياً يقع داخل فترة حجز
                if ($checkDate->betweenIncluded($start, $end->copy()->subDay())) {
                    $conflict = true;
                    // اقفز مباشرة إلى تاريخ خروج هذا الحجز وابدأ الفحص من جديد
                    $checkDate = $end->copy();
                    break;
                }
            }

            // إذا فحصنا جميع الحجوزات ولم نجد تعارضاً مع تاريخنا، إذن هذا هو التاريخ المتاح!
            if (!$conflict) {
                break;
            }
        }

        return [
            'is_booked' => true,
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
