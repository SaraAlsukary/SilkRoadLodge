<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        // اللغات المتاحة في نظامك
        $availableLocales = ['ar', 'en', 'ja', 'es', 'zh','fr'];

        // جلب اللغة المطلوبة من الترويسة
        $locale = $request->header('Accept-Language');

        // إذا كانت اللغة موجودة ضمن اللغات المدعومة، قم بتعيينها
        if (in_array($locale, $availableLocales)) {
            App::setLocale($locale);
        } else {
            // اللغة الافتراضية
            App::setLocale('en');
        }

        return $next($request);
    }
}
