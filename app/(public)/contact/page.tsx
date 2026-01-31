"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert([formData]);

    if (error) {
      toast.error("فشل إرسال الرسالة، حاول مجدداً");
    } else {
      toast.success("تم إرسال رسالتك بنجاح! سنرد عليك قريباً");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* Info Section */}
        <div>
          <h1 className="text-5xl font-black italic mb-6">تواصل <span className="text-yellow-500">معنا</span></h1>
          <p className="text-gray-400 mb-10 text-lg">لديك استفسار أو اقتراح؟ فريق مطعم البركة جاهز دائماً للاستماع إليك.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500"><Phone /></div>
              <div><p className="text-sm text-gray-500">اتصل بنا</p><p className="font-bold">+967 7xx xxx xxx</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500"><Mail /></div>
              <div><p className="text-sm text-gray-500">البريد الإلكتروني</p><p className="font-bold">info@albaraka.com</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500"><MapPin /></div>
              <div><p className="text-sm text-gray-500">العنوان</p><p className="font-bold">عدن - شارع التسعين</p></div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500" />
              <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="الإيميل" className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500" />
            </div>
            <input required name="subject" value={formData.subject} onChange={handleChange} placeholder="الموضوع" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500" />
            <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="رسالتك..." className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 resize-none"></textarea>
            <button disabled={loading} className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all">
              {loading ? "جاري الإرسال..." : <><Send size={20} /> إرسال الرسالة</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}