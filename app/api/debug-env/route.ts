import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Only allow in development or with a secret query param
  const secret = request.nextUrl.searchParams.get('secret')
  const isDev = process.env.NODE_ENV === 'development'
  
  if (!isDev && secret !== 'debug-apptweak-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Test AppTweak API directly
  let appTweakTest = null
  try {
    const testUrl = 'https://public-api.apptweak.com/api/public/store/charts/top-results/current.json?country=us&device=iphone&categories=6004&types=free'
    const response = await fetch(testUrl, {
      headers: {
        'X-Apptweak-Key': process.env.APPTWEAK_API_KEY || 'NO_KEY_FOUND',
        'Accept': 'application/json'
      }
    })
    
    const responseText = await response.text()
    appTweakTest = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      bodyPreview: responseText.substring(0, 200),
      hasError: responseText.includes('error'),
      isJson: responseText.startsWith('{') || responseText.startsWith('[')
    }
  } catch (error) {
    appTweakTest = {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown'
    }
  }

  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasAppTweakKey: !!process.env.APPTWEAK_API_KEY,
      appTweakKeyLength: process.env.APPTWEAK_API_KEY?.length || 0,
      keyFirst4: process.env.APPTWEAK_API_KEY?.substring(0, 4) || 'N/A',
      keyLast4: process.env.APPTWEAK_API_KEY?.slice(-4) || 'N/A',
    },
    appTweakTest,
    timestamp: new Date().toISOString()
  })
}