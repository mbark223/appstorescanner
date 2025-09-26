import { NextRequest, NextResponse } from 'next/server'
import { getAppDetailsWithAppTweak } from '@/lib/api/apptweak'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get('platform') || 'ios' // ios or android
  
  try {
    const appDetails = await getAppDetailsWithAppTweak(
      params.id, 
      platform as 'ios' | 'android',
      'us'
    )
    
    if (!appDetails) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }
    
    return NextResponse.json(appDetails)
  } catch (error) {
    console.error('App details fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch app details',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}