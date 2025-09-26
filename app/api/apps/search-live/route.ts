import { NextRequest, NextResponse } from 'next/server'
import { searchAppsWithAppTweak } from '@/lib/api/apptweak'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const platform = searchParams.get('platform') || 'both' // ios, android, both

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const results = await searchAppsWithAppTweak(query, {
      platform: platform as 'ios' | 'android' | 'both',
      country: 'us',
      limit: 50
    })

    return NextResponse.json({
      apps: results,
      total: results.length,
      page: 1,
      pageSize: results.length,
      source: 'apptweak'
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search apps', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}