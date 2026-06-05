<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // التأكد من عدم تكرار حساب الأدمن إذا تم تشغيل الـ Seeder أكثر من مرة
        User::updateOrCreate(
            ['email' => 'admin@silkroadlodge.com'], // شرط التحقق (إذا وجد الحساب لا يكرره بل يحدثه)
            [
                'name' => 'Silk Road Admin',
                'phone' => '+963900000000', // يمكنكِ تعديل الرمز والرقم حسب الحاجة
                'role' => 'admin',          // الـ enum الذي قمنا بضبطه سابقاً
                'password' => Hash::make('admin_2424'), // كلمة مرور مشفرة وآمنة
                'email_verified_at' => now(),
            ]
        );
    }
}
