import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API routes are working',
    timestamp: new Date().toISOString(),
    env: {
      hasAppTweakKey: !!process.env.APPTWEAK_API_KEY
    }
  })
}