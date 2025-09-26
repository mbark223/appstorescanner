import { NextRequest, NextResponse } from 'next/server'
import { appTweakClient } from '@/lib/api/apptweak'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') || '6004' // 6004 is Sports category
  const platform = searchParams.get('platform') || 'ios'
  const type = searchParams.get('type') || 'free'
  
  console.log('Top charts request:', { category, platform, type })
  
  try {
    // Check if API key is configured
    if (!process.env.APPTWEAK_API_KEY) {
      console.error('APPTWEAK_API_KEY not configured')
      return NextResponse.json({ 
        error: 'API key not configured', 
        details: 'Please configure APPTWEAK_API_KEY in environment variables' 
      }, { status: 500 })
    }
    
    const apps = await appTweakClient.getTopApps(
      category,
      platform as 'ios' | 'android',
      'us',
      type as 'free' | 'paid' | 'grossing'
    )
    
    console.log(`Found ${apps.length} apps for category ${category}`)
    
    return NextResponse.json({
      apps: apps.slice(0, 50), // Top 50 apps
      category,
      platform,
      type
    })
  } catch (error) {
    console.error('Top charts error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch top apps', 
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!process.env.APPTWEAK_API_KEY
    }, { status: 500 })
  }
}