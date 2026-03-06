import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import type { Tables } from '@/types/database'

export default async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName: string | null = null
  let cartCount = 0

  if (user) {
    const [profileRes, cartRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])
    const profile = profileRes.data as Pick<Tables<'profiles'>, 'full_name'> | null
    fullName = profile?.full_name ?? null
    cartCount = cartRes.count ?? 0
  }

  return (
    <header className="bg-white border-b border-surface-gray sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/catalog" aria-label="PimSuea — หน้าแรก">
          <Image src="/logo.svg" alt="PimSuea" width={103} height={39} priority />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/designs"
                className="text-sm font-bold text-deep-black hover:text-brand-green transition-colors hidden sm:block"
              >
                ดีไซน์ของฉัน
              </Link>
              <Link
                href="/orders"
                className="text-sm font-bold text-deep-black hover:text-brand-green transition-colors hidden sm:block"
              >
                คำสั่งซื้อ
              </Link>

              <span className="text-sm font-bold text-deep-black hidden sm:block">
                {fullName ?? user.email}
              </span>

              {/* Cart */}
              <Link href="/cart" className="relative p-1" aria-label="ตะกร้าสินค้า">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-deep-black"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="border border-brand-green text-brand-green text-sm font-bold px-4 py-2 rounded-btn hover:bg-brand-green hover:text-white transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/signup"
                className="bg-brand-orange text-white text-sm font-bold px-4 py-2 rounded-btn hover:opacity-90 transition-opacity"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
