<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // مسح الميديا القديمة بالكامل من قاعدة البيانات قبل إعادة الحقن لعدم التكرار
        DB::table('media')->truncate();

        $rooms = [
            [
                'slug' => 'single_room',
                'guests' => 1,
                'beds' => 1,
                'price' => 50.00,
                'image_name' => '5.PNG', // اسم ملف الصورة الافتراضية
                'name' => [
                    'ar' => 'غرفة لشخص واحد',
                    'en' => 'Single Room',
                    'de' => 'Einzelzimmer',
                    'fr' => 'Chambre Individuelle',
                    'es' => 'Habitación Individual',
                    'zh' => '单人间',
                    'ja' => 'シングルルーム',
                ],
                'description' => [
                    'ar' => 'ملاذ هادئ ومريح مصمم بعناية لشخص واحد، يمنحك الخصوصية الكاملة مع إطلالة ساحرة.',
                    'en' => 'A peaceful and cozy retreat mindfully crafted for one person, offering complete privacy and a lovely view.',
                    'de' => 'Ein ruhiger und gemütlicher Rückzugsort, sorgfältig für eine Person gestaltet, mit absoluter Privatsphäre und einer schönen Aussicht.',
                    'fr' => 'Un havre de paix calme et confortable conçu pour une personne, offrant une intimité totale.',
                    'es' => 'Un refugio tranquilo y acogedor diseñado cuidadosamente para una persona.',
                    'zh' => '为单人精心设计的宁静舒适避风港，为您提供完全的隐私以及迷人的景观。',
                    'ja' => '完全なプライバシーと美しい景色を望む、お一人様のために細部まで心地よく整えられた穏やかな隠れ家です。',
                ]
            ],
            [
                'slug' => 'double_room',
                'guests' => 2,
                'beds' => 1,
                'price' => 50.00,
                'image_name' => '4.PNG',
                'name' => [
                    'ar' => 'غرفة لشخصين بسرير مزدوج واحد',
                    'en' => 'Double Room',
                    'de' => 'Doppelzimmer',
                    'fr' => 'Chambre Double (Un Grand Lit)',
                    'es' => 'Habitación Doble (Cama Matrimonial)',
                    'zh' => '大床双人间',
                    'ja' => 'ダブルルーム',
                ],
                'description' => [
                    'ar' => 'غرفة فسيحة ومثالية لشخصين، تحتوي على سرير مزدوج واحد كبير لراحة مثالية.',
                    'en' => 'A spacious room ideal for two guests, featuring one large double bed for a perfect night\'s rest.',
                    'de' => 'Ein geräumiges Zimmer, ideal für zwei Gäste, mit einem großen Doppelbett für eine perfekte Nachtruhe.',
                    'fr' => 'Une chambre spacieuse idéale for deux personnes, comprenant un grand lit double.',
                    'es' => 'Una habitación espaciosa e ideal para dos personas, que cuenta con una cama doble grande.',
                    'zh' => '宽敞且理想的双人客房，配备一张大双人床，为您带来完美的舒适体验。',
                    'ja' => 'ゆったりとした空間に大型のダブルベッドを1台備え、お二人様で極上の休息をお取りいただける理想的なお部屋です。',
                ]
            ],
            [
                'slug' => 'twin_room',
                'guests' => 2,
                'beds' => 2,
                'price' => 50.00,
                'image_name' => '1.JPG',
                'name' => [
                    'ar' => 'غرفة لشخصين بسريرين منفصلين',
                    'en' => 'Twin Room',
                    'de' => 'Zweibettzimmer',
                    'fr' => 'Chambre Lits Jumeaux',
                    'es' => 'Habitación Doble (Camas Separadas)',
                    'zh' => '双床双人间',
                    'ja' => 'ツインルーム',
                ],
                'description' => [
                    'ar' => 'غرفة مريحة لشخصين، مجهزة بسريرين منفصلين تماماً لتوفر الخصوصية والراحة لكل ضيف.',
                    'en' => 'Comfortable accommodation for two guests, equipped with two separate single beds to provide convenience and privacy.',
                    'de' => 'Komfortable Unterkunft für zwei Gäste, ausgestattet mit zwei separaten Einzelbetten für mehr Flexibilität und Privatsphäre.',
                    'fr' => 'Une chambre confortable pour deux personnes, équipée de deux lits entièrement séparés.',
                    'es' => 'Una habitación confortable para dos personas, equipada con dos camas completamente separadas.',
                    'zh' => '舒适的双人客房，配备两张完全独立的床，为每位宾客提供专属的隐私与舒适。',
                    'ja' => 'お二人様でのご滞在に、独立したシングルベッド2台を配置し、利便性とプライバシーを兼ね備えた快適なお部屋です。',
                ]
            ],
            [
                'slug' => 'triple_room',
                'guests' => 3,
                'beds' => 3,
                'price' => 50.00,
                'image_name' => '3.PNG',
                'name' => [
                    'ar' => 'غرفة لثلاثة أشخاص',
                    'en' => 'Triple Room',
                    'de' => 'Dreibettzimmer',
                    'fr' => 'Chambre Triple',
                    'es' => 'Habitación Triple',
                    'zh' => '三人间',
                    'ja' => 'トリプルルーム',
                ],
                'description' => [
                    'ar' => 'خيار ممتاز للمجموعات الصغيرة والعائلات، تتسع لثلاثة أشخاص وتضم ثلاثة أسرة منفصلة ومريحة.',
                    'en' => 'An excellent choice for small groups and families, accommodating three guests with three separate beds.',
                    'de' => 'Eine hervorragende Wahl für kleine Gruppen und Familien, geeignet für drei Gäste mit drei separaten Betten.',
                    'fr' => 'Un excellent choix pour les petits groupes et les familles, pouvant accueillir trois personnes.',
                    'es' => 'Una excelente opción para grupos pequeños y familias, con capacity para tres personas.',
                    'zh' => '小组出行和家庭的极佳选择，可容纳三人，配有三张独立且舒适的床。',
                    'ja' => '小グループやご家族に最適なお部屋で、独立したベッド3台を配し、3名様まで快適にご宿泊いただけます。',
                ]
            ],
            [
                'slug' => 'quad_room',
                'guests' => 4,
                'beds' => 4,
                'price' => 50.00,
                'image_name' => '2.JPG',
                'name' => [
                    'ar' => 'غرفة لأربعة أشخاص',
                    'en' => 'Quad Room',
                    'de' => 'Vierbettzimmer',
                    'fr' => 'Chambre Quadruple',
                    'es' => 'Habitación Cuádruple',
                    'zh' => '四人间',
                    'ja' => 'クアッドルーム',
                ],
                'description' => [
                    'ar' => 'جناح عائلي واسع يتسع لأربعة أشخاص، مجهز بأربعة أسرة منفصلة لضمان راحة ورفاهية كل فرد.',
                    'en' => 'A generous family-style room that comfortably accommodates four guests, outfitted with four separate beds.',
                    'de' => 'Ein großzügiges Familienzimmer, das bequem Platz für vier Gäste bietet und mit vier separaten Betten ausgestattet ist.',
                    'fr' => 'Une suite familiale spacieuse pouvant accueillir quatre personnes, équipée de quatre lits séparés.',
                    'es' => 'Una amplia suite familiar con capacidad para cuatro personas, equipada con cuatro camas independientes.',
                    'zh' => '宽敞的家庭套房，可容纳四人，配有四张独立的床，确保每位成员的舒适与惬意。',
                    'ja' => '独立したベッド4台を完備し、4名様までゆったりと快適にお過ごしいただける広々としたファミリースタイルの客室です。',
                ]
            ],
        ];

        foreach ($rooms as $roomData) {
            // فصل اسم الصورة قبل الحفظ في جدول الغرف
            $imageName = $roomData['image_name'];
            unset($roomData['image_name']);

            // 1. إنشاء الغرفة في قاعدة البيانات
            $room = Room::create($roomData);

            // 2. المسار الكامل للصورة الافتراضية
            $sourceImagePath = public_path('seed-images/' . $imageName);

            // 3. التأكد من وجود الصورة حركياً ثم ربطها عبر Spatie
            if (File::exists($sourceImagePath)) {
                $room->addMedia($sourceImagePath)
                     ->preservingOriginal() // الحفاظ على النسخة الأصلية في المجلد لعدم حذفها أثناء الـ loop
                     ->toMediaCollection('images');
            }
        }
    }
}
