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
            // ربط الحجز بالغرفة (نوع الغرفة)
            $table->foreignId('room_id')->constrained()->onDelete('cascade');

            // بيانات العميل الشخصية
            $table->string('customer_name');        // الاسم الكامل
            $table->string('customer_phone');       // رقم الهاتف
            $table->string('customer_email');       // البريد الإلكتروني
            $table->enum('gender', ['male', 'female', 'other']); // الجنس
            $table->string('nationality');          // الجنسية
            $table->integer('age');                 // العمر

            // تفاصيل الإقامة
            $table->integer('guests_count');        // عدد الأشخاص
            $table->date('check_in');               // تاريخ تسجيل الدخول
            $table->date('check_out');              // تاريخ تسجيل الخروج

            // الخدمات والملاحظات
            $table->json('requested_services')->nullable(); // الخدمات المطلوبة (مصفوفة مخزنة كـ JSON)
            $table->text('notes')->nullable();              // حقل ملاحظات

            // حالة الحجز
            $table->string('status')->default('confirmed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
