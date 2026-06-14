<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'customer_email',
        'gender',
        'nationality',
        'age',
        'guests_count',
        'rooms_count',
        'double_beds_count',
        'single_beds_count',
        'booked_room_names',
        'check_in',
        'check_out',
        'requested_services',
        'notes',
        'status'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'requested_services' => 'array',
    ];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'booking_room');
    }
}
