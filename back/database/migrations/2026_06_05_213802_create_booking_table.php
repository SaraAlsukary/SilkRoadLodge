<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // بيانات العميل
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('nationality');
            $table->integer('age');

            // تفاصيل الحجز والموارد
            $table->integer('guests_count');
            $table->integer('rooms_count');
            $table->integer('double_beds_count'); // عدد الأسرة المزدوجة المستهلكة
            $table->integer('single_beds_count'); // عدد الأسرة المفردة المستهلكة
            $table->text('booked_room_names');    // النص الجميل الذي سيظهر للإدارة والعميل

            $table->date('check_in');
            $table->date('check_out');

            $table->json('requested_services')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('confirmed');
            $table->timestamps();
        });

        // الجدول الوسيط لربط الحجز بالغرف الفعلية (حجز الوعاء)
        Schema::create('booking_room', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_room');
        Schema::dropIfExists('bookings');
    }
};
