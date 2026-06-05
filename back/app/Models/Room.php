<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations; // 👈 حزمة الترجمة
use App\Models\Booking;
use Carbon\Carbon;
class Room extends Model implements HasMedia
{
    use InteractsWithMedia, HasTranslations;

    protected $fillable = ['name', 'description', 'guests', 'beds', 'price','booking_status'];

    // 💡 إخبار لارافيل بالحقول التي سيتم ترجمتها تلقائياً
    public $translatable = ['name', 'description'];

    protected $appends = ['image_url'];

    /**
     * علاقة الغرفة مع الحجوزات (تأكدي من وجود موديل Booking وجدول للملف)
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
            ->where('status', 'confirmed') // أو حسب حالات الحجز عندك (مؤكد مثلاً)
            ->where('check_in', '<=', $today)
            ->where('check_out', '>=', $today)
            ->first();

        if ($activeBooking) {
            return [
                'is_booked' => true,
                'available_at' => $activeBooking->check_out->format('Y-m-d'), // تاريخ انتهاء الحجز
            ];
        }

        return [
            'is_booked' => false,
            'available_at' => null,
        ];
    }
    public function getImageUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('images') ?: 'https://placehold.co/600x400/8B5E3C/F3E9DC?text=Silk+Road+Hotel';
    }
}
