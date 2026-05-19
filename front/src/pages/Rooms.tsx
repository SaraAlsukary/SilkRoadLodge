import RoomCard from '../components/RoomCard';

const roomsData = [
    {
        id: 1,
        title: "جناح طريق الحرير",
        price: 250,
        description: "استمتع بإقامة ملكية في جناحنا المميز، ذو التصميم التدمري الأصيل وإطلالة بانورامية على واحة النخيل.",
        image: "/imgs/1.jpeg"
    },
    {
        id: 2,
        title: "غرفة القافلة",
        price: 150,
        description: "غرفة مريحة دافئة، توفر لك الهدوء بعد يوم حافل باستكشاف الآثار. مثالية للمسافرين الباحثين عن الأصالة.",
        image: "/imgs/6.jpeg"

    },
    {
        id: 3,
        title: "الخيمة التدمريّة الفاخرة",
        price: 200,
        description: "تجربة فريدة تدمج بين خيام البادية السورية ورفاهية الفنادق العالمية، تحت سماء تدمر المرصعة بالنجوم.",
        image: "/imgs/9.jpeg"

    }
];

export default function Rooms() {
    return (
        <section className="py-20 px-6 bg-silk-cream">
            <div className="max-w-7xl mx-auto">
                {/* العنوان */}
                <div className="text-center mb-16">
                    <h2 className="font-arabic text-4xl text-silk-dark mb-4">غرفنا المميزة</h2>
                    <div className="w-20 h-[2px] bg-silk-sand mx-auto"></div>
                </div>

                {/* شبكة البطاقات */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roomsData.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            </div>
        </section>
    );
}