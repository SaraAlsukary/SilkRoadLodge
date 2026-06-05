<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // 👈 تأكدي من إضافة هذا السطر هنا
            $table->json('name');
            $table->json('description');
            $table->integer('guests');
            $table->integer('beds');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });}

    public function down(): void
    {
        Schema::dropIfExists('room_types');
    }
};
