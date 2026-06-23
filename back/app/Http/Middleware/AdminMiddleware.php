<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // التحقق من أن المستخدم مسجل دخول وله صلاحية admin
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // في حالة الـ API، نرسل استجابة 403 Forbidden بدلاً من Redirect
        return response()->json([
            'message' => 'غير مصرح لك بالوصول إلى هذا المورد.'
        ], 403);
    }
}
