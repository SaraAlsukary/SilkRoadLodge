<?php

// app/Http/Controllers/Api/RoomTypeController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\App;

class RoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // 💡 قراءة اللغة المطلوبة من الفرونت إند وتطبيقها في لارافيل
        $lang = $request->header('Accept-Language', 'en');
        App::setLocale($lang);

        $rooms = Room::all()->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->name,               // يرجع باللغة المطلوبة تلقائياً بفضل الحزمة
                'description' => $room->description, // يرجع باللغة المطلوبة تلقائياً
                'guests' => $room->guests,
                'beds' => $room->beds,
                'slug' => $room->slug,             // رقم السعر الحقيقي
                'price' => $room->price,             // رقم السعر الحقيقي
                'image' => $room->image_url,
            ];
        });

        return response()->json($rooms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
                //
                // مثال لشكل البيانات القادمة من الـ Dashboard:
        // $request->name = ['en' => 'Single Room', 'ar' => 'غرفة مفردة'];

        $room = RoomType::create([
            'name' => $request->name,
            'description' => $request->description,
            'guests' => $request->guests,
            'beds' => $request->beds,
            'price' => $request->price,
        ]);

        if ($request->hasFile('image')) {
            $room->addMediaFromRequest('image')->toMediaCollection('images');
        }
   }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
