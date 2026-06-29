// import { Viewer, Entity, CameraFlyTo, ImageryLayer, PointGraphics } from 'resium';
// import { Cartesian3, Color, SceneMode, Ion, UrlTemplateImageryProvider, JulianDate, CallbackProperty } from 'cesium';
// import 'cesium/Source/Widgets/widgets.css';
// import { useEffect, useMemo, useRef } from 'react';

// // قم بتعريف دالة التحديث خارج المكون أو داخل الـ useMemo
// const getPulsingSize = () => {
//     // التذبذب بين حجم 20 و 40 لتبدو النقاط كبيرة وواضحة
//     const time = Date.now() / 400;
//     return 25 + Math.sin(time) * 15;
// }; 
// Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWRiNjdhNC01NThhLTQ2ODktYWUwOS00ZWNjM2M1Yjg5YjkiLCJpZCI6NDQ5NzcwLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODI1NzU0Nzh9.rfDCHd2stpSigJQ-xM2f66kQFf9BQFXYsARwY3yZoRo';
// export default function Map() {
//     // قائمة المعالم لسهولة إدارتها
//     const locations = [
//         { id: 1, name: "مضمار سباق الهجن", desc: "مضمار سباق الهجن", lng: 38.26603533118415, lat: 34.561283262880984, color: Color.fromCssColorString('#D4A373') }, // لون بني
//         { id: 2, name: "فندق طريق الحرير", desc: "فندق طريق الحرير", lng: 38.276372444532164, lat: 34.555482062932704, color: Color.fromCssColorString('#8B5E3C') }, // لون بني
//         { id: 3, name: "قلعة فخر الدين المعني", desc: "قلعة تاريخية مهيبة.", lng: 38.257170696771084, lat: 34.5628049204892, color: Color.fromCssColorString('#D4A373') }, // لون رملي
//         { id: 4, name: "متحف تدمر", desc: "يضم مجموعة واسعة من الآثار.", lng: 38.27480489989539 ,lat: 34.555422621454, color: Color.fromCssColorString('#D4A373') },
//         { id: 5, name: "معبد بل", desc: "أطلال معبد تأسس عام 32 ميلاديًا.", lng: 38.274068056293984, lat: 34.54748583298795, color: Color.fromCssColorString('#D4A373') },
//         { id: 6, name: "قوس النصر", desc: "بوابة نصر رومانية مهيبة.", lng: 38.27148117740909, lat: 34.549062978933634, color: Color.fromCssColorString('#D4A373') },
//         { id: 7, name: "آثار تدمر الرومانية", desc: "آثار تدمر الرومانية", lng: 38.26804538049396, lat: 34.55154783564766, color: Color.fromCssColorString('#D4A373') },
//         { id: 8, name: "مسرح تدمر", desc: "مسرح تدمر", lng: 38.26887093284579, lat: 34.55062630692691, color: Color.fromCssColorString('#D4A373') },
//         { id: 9, name: "معبد بعل شامين", desc: "معبد بعل شامين", lng: 38.28095411464662, lat: 34.68665512861772, color: Color.fromCssColorString('#D4A373') },
//         { id: 10, name: "معبد اللات", desc: "معبد اللات", lng: 38.26162717970957, lat: 34.55513413085592, color: Color.fromCssColorString('#D4A373') },
//     ];
//     const viewerRef = useRef(null);
//     // خريطة Google Maps Roadmap

//     const lightMapProvider = useMemo(() => {
//         return new UrlTemplateImageryProvider({
//             // هذا هو رابط Google Maps Roadmap
//             url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
//             maximumLevel: 19,
//             credit: '© Google Maps'
//         });
//     }, []);
//     // استخدام useEffect لمسح الطبقات بمجرد تحميل المكون
//     useEffect(() => {
//         if (viewerRef.current && (viewerRef.current as any).cesiumElement) {
//             const viewer = (viewerRef.current as any).cesiumElement ;
//             viewer.imageryLayers.removeAll(); // مسح الطبقات الافتراضية
//         }
//     }, []);
//     return (
//         <div className="max-w-5xl mx-auto p-8 my-10 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--color-silk-cream)', color: 'var(--color-silk-dark)', fontFamily: 'var(--font-arabic)' }}>

//             {/* القسم العلوي: العنوان */}
//             <div className="text-center mb-8">
//                 <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-silk-brown)' }}>
//                     اكتشف موقعنا واَثارات تدمر العريقة
//                 </h2>
//                 <p className="text-xl" style={{ color: 'var(--color-silk-dark)', opacity: 0.8 }}>
//                     تصفح المعالم السياحية القريبة من فندق طريق الحرير عبر خريطتنا التفاعلية
//                 </p>
//             </div>

//             {/* القسم الأوسط: خريطة Cesium ثنائية الأبعاد */}
//             <div className="w-full h-[500px] relative rounded-xl overflow-hidden shadow-inner border-4" style={{ borderColor: 'var(--color-silk-brown)' }}>
//                 <Viewer
//                     full={false}
//                     ref={viewerRef} // ربط الـ ref هنا
//                     sceneMode={SceneMode.SCENE2D}
//                     baseLayerPicker={false}
//                     geocoder={false}
//                     homeButton={false}
//                     sceneModePicker={false}
//                     navigationHelpButton={false}
//                     animation={false}
//                     timeline={false}
//                     fullscreenButton={false}
//                 >
//                     <ImageryLayer imageryProvider={lightMapProvider} />

//                     <CameraFlyTo
//                         destination={Cartesian3.fromDegrees(38.2650, 34.5500, 5000)}
//                         duration={0}
//                     />

//                     {/* رسم المعالم السياحية كعلامات */}
//                     {locations.map((loc) => (
//                         <Entity
//                             key={loc.id}
//                             position={Cartesian3.fromDegrees(loc.lng, loc.lat, 0)}
//                             name={loc.name}
//                             description={loc.desc}
//                         >
//                             <PointGraphics
//                                 pixelSize={new CallbackProperty(getPulsingSize, false)}
//                                 color={loc.color} // اللون الأساسي للنقطة
//                                 outlineColor={Color.WHITE} // الوميض الأبيض
//                                 outlineWidth={new CallbackProperty(() => {
//                                     // الوميض الأبيض يزداد ويقل سمكه مع الزمن ليعطي تأثير الوميض
//                                     const time = Date.now() / 400;
//                                     return 5 + Math.sin(time) * 3;
//                                 }, false)}
//                             />
//                         </Entity>
//                     ))}
//                 </Viewer>
//             </div>

//             {/* القسم السفلي: زر الانتقال للخريطة 3D */}
//             <div className="text-center mt-10">
//                 <button
//                     onClick={() => window.location.href = '/3d-map'} // عدل مسار الرابط حسب هيكل مشروعك
//                     className="px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
//                     style={{
//                         backgroundColor: 'var(--color-silk-brown)',
//                         color: 'var(--color-silk-cream)',
//                         fontFamily: 'var(--font-arabic)'
//                     }}
//                     onMouseOver={(e) => (e.target as any).style.backgroundColor = 'var(--color-silk-sand)'}
//                     onMouseOut={(e) => (e.target as any).style.backgroundColor = 'var(--color-silk-brown)'}
//                 >
//                     اكتشف الخريطة ثلاثية الأبعاد (3D)
//                 </button>
//             </div>

//         </div>
//     );
// }

import { Viewer, Entity, CameraFlyTo, ImageryLayer, PointGraphics,  BillboardGraphics } from 'resium';
import { Cartesian3, Color, SceneMode, Ion, UrlTemplateImageryProvider, CallbackProperty, Cartesian2 } from 'cesium';
import 'cesium/Source/Widgets/widgets.css';
import { useEffect, useMemo, useRef } from 'react';
import { t } from 'i18next';

// قم بتعريف دالة التحديث خارج المكون أو داخل الـ useMemo
const getPulsingSize = () => {
    // التذبذب بين حجم 20 و 40 لتبدو النقاط كبيرة وواضحة
    const time = Date.now() / 400;
    return 25 + Math.sin(time) * 15;
};
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWRiNjdhNC01NThhLTQ2ODktYWUwOS00ZWNjM2M1Yjg5YjkiLCJpZCI6NDQ5NzcwLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODI1NzU0Nzh9.rfDCHd2stpSigJQ-xM2f66kQFf9BQFXYsARwY3yZoRo';
export default function PalmyraMap() {
    // قائمة المعالم لسهولة إدارتها
    const locations = [
        { id: 1, name: "مضمار سباق الهجن", desc: "مضمار سباق الهجن", lng: 38.26603533118415, lat: 34.561283262880984, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/camel.jpg' }, // لون بني
        { id: 2, name: "فندق طريق الحرير", desc: "فندق طريق الحرير", lng: 38.276372444532164, lat: 34.555482062932704, color: Color.fromCssColorString('#8B5E3C'), image: '/imgs/maps/silk.jpg' }, // لون بني
        { id: 3, name: "قلعة فخر الدين المعني", desc: "قلعة تاريخية مهيبة.", lng: 38.257170696771084, lat: 34.5628049204892, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/jamal.jpg' }, // لون رملي
        { id: 4, name: "متحف تدمر", desc: "يضم مجموعة واسعة من الآثار.", lng: 38.27480489989539, lat: 34.555422621454, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/mues.jpeg' },
        { id: 5, name: "معبد بل", desc: "أطلال معبد تأسس عام 32 ميلاديًا.", lng: 38.274068056293984, lat: 34.54748583298795, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/bel.jpg' },
        { id: 6, name: "قوس النصر", desc: "بوابة نصر رومانية مهيبة.", lng: 38.27148117740909, lat: 34.549062978933634, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/arch.jpg' },
        { id: 7, name: "آثار تدمر الرومانية", desc: "آثار تدمر الرومانية", lng: 38.26804538049396, lat: 34.55154783564766, color: Color.fromCssColorString('#D4A373') , image: '/imgs/maps/ruins.jpg'},
        { id: 8, name: "مسرح تدمر", desc: "مسرح تدمر", lng: 38.26887093284579, lat: 34.55062630692691, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/theater.jpg' },
        { id: 9, name: "معبد بعل شامين", desc: "معبد بعل شامين", lng: 38.28095411464662, lat: 34.68665512861772, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/shamin.jpg' },
        { id: 10, name: "معبد اللات", desc: "معبد اللات", lng: 38.26162717970957, lat: 34.55513413085592, color: Color.fromCssColorString('#D4A373'), image: '/imgs/maps/lat.jpeg' },
    ];
    const viewerRef = useRef(null);
    // خريطة Google Maps Roadmap

    const lightMapProvider = useMemo(() => {
        return new UrlTemplateImageryProvider({
            // هذا هو رابط Google Maps Roadmap
            url: 'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
            maximumLevel: 19,
            credit: '© Google Maps'
        });
    }, []);
    // استخدام useEffect لمسح الطبقات بمجرد تحميل المكون
    useEffect(() => {
        if (viewerRef.current && (viewerRef.current as any).cesiumElement) {
            const viewer = (viewerRef.current as any).cesiumElement;
            viewer.imageryLayers.removeAll(); // مسح الطبقات الافتراضية
        }
    }, []);
    return (
        <div className="max-w-5xl mx-auto p-8 my-10 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--color-silk-cream)', color: 'var(--color-silk-dark)', fontFamily: 'var(--font-arabic)' }}>

            {/* القسم العلوي: العنوان */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-silk-brown)' }}>
                    اكتشف موقعنا واَثارات تدمر العريقة
                </h2>
                <p className="text-xl" style={{ color: 'var(--color-silk-dark)', opacity: 0.8 }}>
                    تصفح المعالم السياحية القريبة من فندق طريق الحرير عبر خريطتنا التفاعلية
                </p>
            </div>

            {/* القسم الأوسط: خريطة Cesium ثنائية الأبعاد */}
            <div className="w-full h-[500px] relative rounded-xl overflow-hidden shadow-inner border-4" style={{ borderColor: 'var(--color-silk-brown)' }}>
                <Viewer
                    full
                    ref={viewerRef} // ربط الـ ref هنا
                    sceneMode={SceneMode.SCENE2D}
                    baseLayerPicker={false}
                    geocoder={false}
                    homeButton={false}
                    sceneModePicker={false}
                    navigationHelpButton={false}
                    animation={false}
                    timeline={false}
                    fullscreenButton={false}
                    
                >
                    <ImageryLayer imageryProvider={lightMapProvider} />

                    <CameraFlyTo
                        destination={Cartesian3.fromDegrees(38.2650, 34.5500, 5000)}
                        duration={0}
                    />

                    {/* رسم المعالم السياحية كعلامات */}
                    {locations.map((loc) => (
                        <Entity
                            key={loc.id}
                            position={Cartesian3.fromDegrees(loc.lng, loc.lat, 0)}
                            name={t(`places.place_${loc.id}.name`)} // جلب الاسم المترجم
                            description={t(`places.place_${loc.id}.desc`)}
                        >
                            <PointGraphics
                                pixelSize={new CallbackProperty(getPulsingSize, false)}
                                color={loc.color} // اللون الأساسي للنقطة
                                outlineColor={Color.WHITE} // الوميض الأبيض
                                outlineWidth={new CallbackProperty(() => {
                                    // الوميض الأبيض يزداد ويقل سمكه مع الزمن ليعطي تأثير الوميض
                                    const time = Date.now() / 400;
                                    return 5 + Math.sin(time) * 3;
                                }, false)}
                            />
                            {loc.image && (
                                <BillboardGraphics
                                    image={loc.image}
                                    scale={0.30} // يمكنك تعديل الرقم لتكبير أو تصغير الصورة
                                    verticalOrigin={0}
                                    
                                    // لضمان ظهور الصورة فوق إحداثيات النقطة وليس فوقها مباشرة
                                    pixelOffset={new Cartesian2(0, -25)} // رفع الصورة للأعلى بمقدار 25 بكسل لتجنب تغطية النقطة
                                />
                            )}
                        </Entity>
                    ))}
                </Viewer>
            </div>

            {/* القسم السفلي: زر الانتقال للخريطة 3D */}
            {/* <div className="text-center mt-10">
                <button
                    onClick={() => window.location.href = '/3d-map'} // عدل مسار الرابط حسب هيكل مشروعك
                    className="px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    style={{
                        backgroundColor: 'var(--color-silk-brown)',
                        color: 'var(--color-silk-cream)',
                        fontFamily: 'var(--font-arabic)'
                    }}
                    onMouseOver={(e) => (e.target as any).style.backgroundColor = 'var(--color-silk-sand)'}
                    onMouseOut={(e) => (e.target as any).style.backgroundColor = 'var(--color-silk-brown)'}
                >
                    اكتشف الخريطة ثلاثية الأبعاد (3D)
                </button>
            </div> */}

        </div>
    );
}