"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // أضفنا useRouter
import { supabase } from "@/lib/supabase";
import { CheckCircle, ShoppingBag, Clock, ChefHat, PackageCheck, XCircle } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");
  const total = searchParams.get("total");
  const [status, setStatus] = useState("قيد الانتظار");

  useEffect(() => {
    if (!orderId) return;

    const fetchInitialStatus = async () => {
      const { data } = await supabase.from("orders").select("status").eq("id", orderId).single();
      if (data) setStatus(data.status);
    };
    fetchInitialStatus();

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders',
        filter: `id=eq.${orderId}` 
      }, (payload) => {
        setStatus(payload.new.status);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  // دالة لمسح الطلب من المتصفح وإخفائه من النافبار
  const clearTracking = () => {
    localStorage.removeItem("lastOrderId");
    localStorage.removeItem("lastOrderTotal");
    // إرسال حدث للنافبار ليختفي الزر فوراً
    window.dispatchEvent(new Event("order-placed"));
    router.push("/menu"); // العودة للمنيو
  };

  const steps = [
    { name: "قيد الانتظار", icon: <Clock size={20} />, color: "bg-gray-500" },
    { name: "جاري التحضير", icon: <ChefHat size={20} />, color: "bg-blue-500" },
    { name: "جاهز للاستلام", icon: <PackageCheck size={20} />, color: "bg-green-500" },
  ];

  const currentStepIndex = steps.findIndex(s => s.name === status);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans" dir="rtl">
      <div className="mb-6 bg-green-500/10 p-4 rounded-full">
        <CheckCircle size={50} className="text-green-500 animate-pulse" />
      </div>
      
      <h1 className="text-3xl font-black mb-8 text-yellow-500 italic text-center">طلبك قيد المتابعة</h1>

      {/* شريط الحالة */}
      <div className="w-full max-w-md mb-10 space-y-8">
        <div className="flex justify-between relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-yellow-500 -translate-y-1/2 z-0 transition-all duration-1000" 
            style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full transition-all duration-500 ${
                index <= currentStepIndex ? "bg-yellow-500 text-black scale-110 shadow-[0_0_15px_rgba(234,179,8,0.5)]" : "bg-[#111] text-gray-600"
              }`}>
                {step.icon}
              </div>
              <span className={`text-[10px] font-black ${index <= currentStepIndex ? "text-white" : "text-gray-600"}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* تفاصيل الطلب */}
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
            <span className="text-gray-500 font-bold">رقم الطلب:</span>
            <span className="text-xl font-black tracking-widest text-white">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-2xl font-black mb-8">
            <span>الإجمالي:</span>
            <span className="text-yellow-500">{total} ر.ي</span>
        </div>
        
        {/* الحالة النهائية */}
        {status === "جاهز للاستلام" && (
          <div className="bg-green-500/20 text-green-500 p-4 rounded-2xl text-center font-bold mb-4 animate-bounce">
            وجبتك جاهزة! تفضل باستلامها 🏃‍♂️
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-10 w-full max-w-md">
        <Link href="/menu" className="flex items-center justify-center gap-2 bg-white/5 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all border border-white/5">
          <ShoppingBag size={20} /> العودة للمنيو
        </Link>

        {/* زر إنهاء المتابعة */}
        <button 
          onClick={clearTracking}
          className="flex items-center justify-center gap-2 text-red-500/50 hover:text-red-500 transition-colors font-bold text-sm"
        >
          <XCircle size={16} /> إنهاء متابعة الطلب وإخفاؤه
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessContent />
    </Suspense>
  );
}