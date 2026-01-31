"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase"; // سيستخدم الآن createBrowserClient
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthError } from "@supabase/supabase-js";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        const authError = error as AuthError;
        toast.error(authError.message === "Invalid login credentials" 
          ? "البيانات غير صحيحة" 
          : authError.message
        );
      } else {
        toast.success("تم الدخول بنجاح");
        
        // 1. تحديث الراوتر ليقرأ الكوكيز الجديدة
        router.refresh();
        
        // 2. التحويل القسري للداشبورد
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6" dir="rtl">
      <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl">
        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-6">B</div>
        <h2 className="text-3xl font-black text-white mb-8 text-center italic">دخول الإدارة</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            required type="email" placeholder="البريد الإلكتروني" value={email}
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all text-right"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          />
          <input 
            required type="password" placeholder="كلمة المرور" value={password}
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all text-right"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
          />
          <button 
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-xl hover:bg-yellow-400 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? "جاري التحقق..." : "دخول النظام"}
          </button>
        </form>
      </div>
    </div>
  );
}