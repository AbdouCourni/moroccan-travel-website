// src/app/api/well-known/api-catalog/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    "linkset": [{
      "anchor": "https://morocompase.com/api",
      "links": [
        {
          "rel": "service-doc",
          "href": "https://morocompase.com/api/docs",
          "type": "text/html",
          "title": "API Documentation"
        },
        {
          "rel": "collection",
          "href": "https://morocompase.com/api/destinations",
          "type": "application/json",
          "title": "Destinations"
        }
      ]
    }]
  }, {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}