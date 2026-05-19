interface IRoom {
    image: string,
    title: string,
    price: number,
    description: string
}
export default function RoomCard({ room }: { room: IRoom }) {
    return (
        <div className="group bg-white border border-silk-sand/20 overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* صورة الغرفة */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-silk-brown/90 text-silk-cream px-3 py-1 font-arabic text-sm">
                    {room.price} $ / ليلة
                </div>
            </div>

            {/* محتوى البطاقة */}
            <div className="p-6 text-center">
                <h3 className="font-arabic text-2xl text-silk-dark mb-3">{room.title}</h3>
                <p className="font-arabic text-silk-dark/70 text-sm leading-relaxed mb-6">
                    {room.description}
                </p>
                <button className="cursor-pointer w-full py-3 border border-silk-brown text-silk-brown font-arabic text-lg hover:bg-silk-brown hover:text-silk-cream transition-colors duration-300">
                    حجز الغرفة
                </button>
            </div>
        </div>
    );
}