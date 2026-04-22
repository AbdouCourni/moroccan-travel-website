// src/middleware.ts
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

// Check if the request wants markdown (for AI agents)
function wantsMarkdown(request: NextRequest): boolean {
  const acceptHeader = request.headers.get('accept') || ''
  return acceptHeader.includes('text/markdown')
}

// Generate markdown version of a page (simplified version)
async function generateMarkdownPage(pathname: string, locale: string): Promise<string | null> {
  // List of pages that should have markdown versions for agents
  const markdownPages = [
    '/discover-morocco',
    '/destinations',
    '/blog'
  ]
  
  // Check if this path should have markdown
  const shouldHaveMarkdown = markdownPages.some(page => pathname === page || pathname.startsWith(page + '/'))
  
  if (!shouldHaveMarkdown) {
    return null
  }
  
  // For now, return a simple markdown version
  // In production, you'd fetch from your CMS or generate dynamically
  return `# MoroCompase Travel Guide

Welcome to MoroCompase, your complete guide to discovering Morocco.

## Quick Navigation

- [Destinations](/destinations)
- [Travel Tips](/blog)
- [Discover Morocco](/discover-morocco)

## About This Page

This is a markdown version of ${pathname} for AI agents and crawlers.

For the full interactive experience, please visit our website at https://morocompase.com${pathname}

---
*Last updated: ${new Date().toISOString()}*`
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  
  // ============================================
  // 1. EXISTING LOCALE HANDLING (YOUR CODE)
  // ============================================
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    
    // Preserve search params
    newUrl.search = request.nextUrl.search
    
    const redirectResponse = NextResponse.redirect(newUrl)
    
    // Add agent headers to redirect as well
    redirectResponse.headers.set(
      'Link',
      '</.well-known/api-catalog>; rel="api-catalog", ' +
      '</.well-known/agent-skills/index.json>; rel="agent-skills", ' +
      '</sitemap.xml>; rel="sitemap"'
    )
    
    return redirectResponse
  }

  // ============================================
  // 2. MARKDOWN CONTENT NEGOTIATION (NEW)
  // ============================================
  // If agent requests markdown and we're on a relevant page
  if (wantsMarkdown(request)) {
    // Remove locale from pathname for markdown generation
    let pathWithoutLocale = pathname
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}`)) {
        pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
        break
      }
    }
    
    const markdownContent = await generateMarkdownPage(pathWithoutLocale, getLocale(request))
    
    if (markdownContent) {
      return new NextResponse(markdownContent, {
        headers: {
          'Content-Type': 'text/markdown',
          'Cache-Control': 'public, max-age=3600',
          'X-Markdown-Version': '1.0',
        },
      })
    }
  }

  // ============================================
  // 3. AGENT DISCOVERY HEADERS (NEW)
  // ============================================
  // Add Link headers for agent discovery on all pages
  response.headers.set(
    'Link',
    '</.well-known/api-catalog>; rel="api-catalog", ' +
    '</.well-known/agent-skills/index.json>; rel="agent-skills", ' +
    '</.well-known/mcp/server-card.json>; rel="mcp-server", ' +
    '</sitemap.xml>; rel="sitemap"'
  )
  
  // Add security headers (optional but recommended)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Add agent-specific headers
  response.headers.set('X-Robots-Tag', 'index, follow')
  response.headers.set('Accept-Patch', 'application/json')
  
  return response
}

export const config = {
  matcher: [
    // Skip all internal paths and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
}