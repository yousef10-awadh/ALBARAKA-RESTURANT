import { createBrowserClient } from '@supabase/ssr'

// تأكد من أن المتغيرات البيئية صحيحة وموجودة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!



// نستخدم createBrowserClient بدلاً من createClient العادية
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey ,{
  auth: {
    persistSession: true, // تأكيد حفظ الجلسة [cite: 2026-01-31]
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});