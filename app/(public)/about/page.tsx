"use client";

import { Utensils, Award, Users, Clock, Heart, Star } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: <Utensils className="text-yellow-500" size={24} />, label: "وجبة فريدة", value: "50+" },
    { icon: <Users className="text-yellow-500" size={24} />, label: "زبون سعيد", value: "10k+" },
    { icon: <Award className="text-yellow-500" size={24} />, label: "سنة خبرة", value: "15+" },
    { icon: <Star className="text-yellow-500" size={24} />, label: "تقييم ممتاز", value: "4.9" },
  ];

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Hero Section - نص قصة البركة */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1550966841-3ee3ad359051?q=80&w=2070" 
          alt="Baraka Atmosphere" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
        />
        <div className="relative z-20 text-center px-6">
          <span className="text-yellow-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">منذ عام 2010</span>
          <h1 className="text-6xl md:text-8xl font-black italic mb-6 tracking-tighter">
            عن مطعم <span className="text-yellow-500">البركة</span>
          </h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            حيث يلتقي عبق الماضي مع فن الطهي الحديث لنقدم لكم تجربة استثنائية في قلب عدن.
          </p>
        </div>
      </section>

      {/* Story Section - قصتنا */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-6 bg-yellow-500/10 rounded-[4rem] blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1541510910359-5296b5180c3f?q=80&w=2070" 
                alt="Cooking" 
                className="rounded-[2rem] h-80 w-full object-cover border border-white/5 shadow-2xl mt-12"
              />
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070" 
                alt="Food" 
                className="rounded-[2rem] h-80 w-full object-cover border border-white/5 shadow-2xl"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 text-right">
            <div className="inline-flex items-center gap-2 text-yellow-500 font-bold bg-yellow-500/10 px-4 py-2 rounded-full text-sm">
              <Heart size={16} /> سر المهنة
            </div>
            <h2 className="text-5xl font-black italic">نطبخ بكل <span className="text-yellow-500">حب</span> وشغف</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              في مطعم البركة، نؤمن بأن الطعام ليس مجرد وقود للجسم، بل هو لغة تعبر عن الثقافة والكرم. كل طبق يخرج من مطبخنا هو نتاج ساعات من التحضير الدقيق باستخدام وصفات سرية توارثناها عبر الأجيال.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              نلتزم باستخدام أجود أنواع اللحوم الطازجة والخضروات التي يتم جلبها يومياً من المزارع المحلية، لنضمن لكم البركة في كل لقمة.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2.5rem] hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black rounded-2xl border border-white/5 shadow-inner">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-bold">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - قيمنا */}
      <section className="bg-[#050505] py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black mb-20 italic">لماذا يختارنا <span className="text-yellow-500">الجميع؟</span></h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="group">
              <div className="w-24 h-24 bg-black border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500 rotate-3 group-hover:rotate-0 shadow-2xl shadow-yellow-500/5">
                <Utensils size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">المذاق الأصيل</h3>
              <p className="text-gray-500 leading-relaxed px-4">نحافظ على نكهة الطبخ التقليدي الذي يذكرك بلمة العائلة ودفء المنزل.</p>
            </div>

            <div className="group">
              <div className="w-24 h-24 bg-black border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500 -rotate-3 group-hover:rotate-0 shadow-2xl shadow-yellow-500/5">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">خدمة ملكية</h3>
              <p className="text-gray-500 leading-relaxed px-4">فريقنا مدرب ليقدم لك تجربة مريحة وسريعة تليق بضيوف مطعم البركة.</p>
            </div>

            <div className="group">
              <div className="w-24 h-24 bg-black border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500 rotate-6 group-hover:rotate-0 shadow-2xl shadow-yellow-500/5">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">التزامنا بالوقت</h3>
              <p className="text-gray-500 leading-relaxed px-4">نحن نعلم أن الجوع لا ينتظر، لذلك نحرص على تقديم طلباتكم في وقت قياسي وبجودة عالية.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}