// public/robots/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `# Robots.txt for MoroCompase - Morocco Travel Guide
# Allow all crawlers by default
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Sitemap location
Sitemap: https://morocompase.com/sitemap.xml

# AI Crawler Rules - Opt out of AI training
User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /


# Crawl delay
Crawl-delay: 1

# Host
Host: https://morocompase.com
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}