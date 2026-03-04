import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Route protection (auth guards) is added in T07.
// This middleware only refreshes the Supabase session on every request.
export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
