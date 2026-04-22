// src/app/api/well-known/agent-skills/index/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    "$schema": "https://agentskills.io/schema.json",
    "version": "0.2.0",
    "skills": [
      {
        "name": "destinations-search",
        "type": "api",
        "description": "Search Morocco destinations",
        "url": "https://morocompase.com/api/destinations",
        "capabilities": ["search", "filter"]
      },
      {
        "name": "trip-planner",
        "type": "interactive",
        "description": "AI-powered trip planning",
        "url": "https://morocompase.com/ai-trip-planner",
        "capabilities": ["itinerary", "budget"]
      }
    ]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}