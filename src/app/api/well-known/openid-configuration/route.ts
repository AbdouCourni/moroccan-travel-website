// app/api/well-known/openid-configuration/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const oidcConfig = {
    "issuer": "https://morocompase.com",
    "authorization_endpoint": "https://morocompase.com/api/auth/authorize",
    "token_endpoint": "https://morocompase.com/api/auth/token",
    "userinfo_endpoint": "https://morocompase.com/api/auth/userinfo",
    "jwks_uri": "https://morocompase.com/.well-known/jwks.json",
    "registration_endpoint": "https://morocompase.com/api/auth/register",
    "scopes_supported": ["openid", "profile", "email", "offline_access"],
    "response_types_supported": ["code", "token", "id_token"],
    "grant_types_supported": [
      "authorization_code",
      "refresh_token",
      "client_credentials"
    ],
    "token_endpoint_auth_methods_supported": [
      "client_secret_basic",
      "client_secret_post"
    ],
    "subject_types_supported": ["public"],
    "id_token_signing_alg_values_supported": ["RS256"],
    "claims_supported": [
      "sub",
      "iss",
      "name",
      "email",
      "email_verified",
      "profile_picture"
    ],
    "code_challenge_methods_supported": ["S256"],
    "revocation_endpoint": "https://morocompase.com/api/auth/revoke",
    "end_session_endpoint": "https://morocompase.com/api/auth/logout"
  };

  return NextResponse.json(oidcConfig, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}