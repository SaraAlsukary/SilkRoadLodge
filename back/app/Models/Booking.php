<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Room;
class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'gender',
        'nationality',
        'age',
        'guests_count',
        'check_in',
        'check_out',
        'requested_services',
        'notes',
        'status'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'requested_services' => 'array', // تحويل حقل الخدمات تلقائياً إلى مصفوفة (Array)
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
