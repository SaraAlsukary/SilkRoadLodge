<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * تسجيل دخول الأدمن وإصدار التوكن (API Token)
     */
        public function login(Request $request)
        {
            // 1. التحقق من البيانات المدخلة
            $request->validate([
                'email'    => 'required|email',
                'password' => 'required|string',
            ]);

            // 2. محاولة تسجيل الدخول بالبيانات المرسلة
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات تسجيل الدخول غير صحيحة.'
                ], 401); // 🔴 تم تصحيح هذا السطر
            }

            // 3. جلب بيانات المستخدم الذي سجل دخوله
            $user = Auth::user();

            // 4. الجدار الأمني: التأكد من أن دور المستخدم هو admin فعلاً
            if ($user->role !== 'admin') {
                // تسجيل خروج فوري إذا لم يكن أدمن
                Auth::logout();

                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح لك بالدخول، هذا الحساب ليس مسؤولاً (Admin).'
                ], 403); // 403 Forbidden
            }

            // 5. إنشاء التوكن الخاص بـ React (Laravel Sanctum)
            $token = $user->createToken('admin_auth_token')->plainTextToken;

            // 6. إرجاع الاستجابة بنجاح مع التوكن بيانات الأدمن
            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح.',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ], 200);
        }
    /**
     * تسجيل خروج الأدمن وحذف التوكن الحالي
     */
    public function logout(Request $request)
    {
        // حذف التوكن الحالي للأدمن لتبطيل مفعوله
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح.'
        ], 200);
    }
    /**
 * جلب بيانات الأدمن المسجل دخوله حالياً (للتحقق الصارم في الـ React)
 */
public function me(Request $request)
{
    // جلب المستخدم الحالي الموثق عبر التوكن
    $user = $request->user();

    // جدار حماية إضافي: التأكد من أن التوكن يخص أدمن فعلاً
    if ($user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'غير مصرح لك بالوصول لهذه البيانات.'
        ], 403);
    }

    return response()->json([
        'success' => true,
        'user' => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]
    ], 200);
}
}
