<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('/rooms',RoomController::class);
Route::apiResource('bookings', BookingController::class);
Route::get('/check-resources', [BookingController::class,'checkResources']);



Route::get('/rooms/{room}/booked-dates', [BookingController::class, 'getBookedDates']);
// مسار تسجيل دخول الأدمن
Route::post('/admin/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    // مسار التحقق وجلب بيانات الأدمن الحالي (يستدعيه React في كل تحديث للصفحة)
    Route::get("/admin/me", [AuthController::class, 'me']);

    // مسار تسجيل خروج الأدمن وإتلاف التوكن
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    // 💡 أمثلة لمسارات إضافية قد تحتاجها للوحة التحكم مستقبلاً:
    // Route::get('/admin/bookings', [BookingController::class, 'index']); // عرض كل الحجوزات للإدارة
    // Route::delete('/admin/bookings/{id}', [BookingController::class, 'destroy']); // إلغاء حجز
});
