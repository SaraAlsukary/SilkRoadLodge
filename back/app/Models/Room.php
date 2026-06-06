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
     * جلب حالة الحجز الحالية ديناميكياً بناءً على الوقت الحالي
     */
    public function getBookingStatusAttribute(): array
    {
        $today = Carbon::today();

        // البحث عن حجز نشط يغطي تاريخ اليوم
        $activeBooking = $this->bookings()
            ->where('status', 'confirmed')
            ->where('check_in', '<=', $today)
            ->where('check_out', '>=', $today)
            ->first();

        if ($activeBooking) {
            // التأكد من تحويل النص إلى Carbon بأمان قبل عمل format
            $checkOutDate = Carbon::parse($activeBooking->check_out);

            return [
                'is_booked' => true,
                'available_at' => $checkOutDate->format('Y-m-d'),
            ];
        }

        return [
            'is_booked' => false,
            'available_at' => null,
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
