import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'fr', 'ar', 'es']
const defaultLocale = 'en'

// Get the preferred locale from cookie or accept-language header
function getLocale(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get('moroCompase-language')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Fallback to accept-language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0]
    if (locales.includes(preferredLang)) {
      return preferredLang
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect to add locale prefix
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
}