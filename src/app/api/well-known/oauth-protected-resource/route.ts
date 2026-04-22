// app/api/well-known/oauth-protected-resource/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const protectedResource = {
    "resource": "https://morocompase.com/api",
    "authorization_servers": [
      "https://morocompase.com"
    ],
    "scopes_supported": [
      "read:destinations",
      "write:trip",
      "read:profile",
      "book:stays",
      "book:transport"
    ],
    "bearer_methods_supported": [
      "header",
      "body",
      "query"
    ],
    "resource_name": "MoroCompase API",
    "resource_description": "Access to Morocco travel data and booking services",
    "documentation": "https://morocompase.com/api/docs"
  };

  return NextResponse.json(protectedResource, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}