import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// استخدام export default لضمان تعرف Next.js على الدالة [cite: 2026-01-31]
export default async function middleware(request: NextRequest) {
  
  // 1. إعداد الاستجابة الأولية
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. إعداد سوبابيس للتعامل مع الكوكيز
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. جلب المستخدم
  const { data: { user } } = await supabase.auth.getUser()

  // 4. منطق الحماية والتحويل
  // إذا حاول دخول الداشبورد وهو غير مسجل -> لوجن
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // إذا حاول دخول اللوجن وهو مسجل -> داشبورد
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// 5. تحديد المسارات التي يعمل عليها الميدل وير
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}