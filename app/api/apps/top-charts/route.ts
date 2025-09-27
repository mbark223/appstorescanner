import { NextRequest, NextResponse } from 'next/server'
import { appTweakClient } from '@/lib/api/apptweak'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') || '6004' // 6004 is Sports category
  const country = searchParams.get('country') || 'us'
  const platform = searchParams.get('platform') || 'ios'
  const type = searchParams.get('type') || 'free'
  
  console.log('Top charts request:', { category, country, platform, type })
  console.log('AppTweak API key present:', !!process.env.APPTWEAK_API_KEY)
  console.log('API key length:', process.env.APPTWEAK_API_KEY?.length)
  
  try {
    // First try AppTweak API
    if (process.env.APPTWEAK_API_KEY) {
      try {
        const apps = await appTweakClient.getTopApps(
          category,
          platform as 'ios' | 'android',
          country,
          type as 'free' | 'paid' | 'grossing'
        )
        
        if (apps.length > 0) {
          console.log(`AppTweak returned ${apps.length} apps`)
          return NextResponse.json({
            apps: apps.map((app, index) => ({
              ...app,
              rank: index + 1,
              price: type === 'paid' ? '$0.99' : 'Free'
            })),
            category,
            country,
            platform,
            type,
            total: apps.length,
            source: 'apptweak'
          })
        }
      } catch (appTweakError) {
        console.error('AppTweak error details:', {
          error: appTweakError instanceof Error ? appTweakError.message : appTweakError,
          stack: appTweakError instanceof Error ? appTweakError.stack : undefined
        })
        console.log('Falling back to RSS feeds...')
      }
    }
    
    // Fallback to iTunes RSS feeds
    console.log('Using iTunes RSS fallback')
    let url = ''
    
    if (platform === 'ios') {
      const genreParam = category !== '0' ? `/genre=${category}` : ''
      url = `https://rss.itunes.apple.com/api/v1/${country}/ios-apps/top-${type}/all/50${genreParam}/explicit.json`
    } else {
      // Android RSS feeds
      url = `https://rss.itunes.apple.com/api/v1/${country}/apps/top-${type}/all/50/explicit.json`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    
    // Convert RSS format to our App format
    const apps = (data.feed?.results || []).map((item: any, index: number) => ({
      id: item.id,
      name: item.name,
      developer: item.artistName,
      icon: item.artworkUrl100,
      rating: 4.5, // RSS doesn't provide ratings
      ratingsCount: Math.floor(Math.random() * 100000), // Simulated
      category: item.genres?.[0]?.name || 'Other',
      platform: platform as 'ios' | 'android',
      appStoreId: item.id,
      price: type === 'paid' ? (item.price || '$0.99') : 'Free',
      rank: index + 1
    }))
    
    return NextResponse.json({
      apps: apps,
      category,
      country,
      platform,
      type,
      total: apps.length,
      source: 'rss'
    })
  } catch (error) {
    console.error('Top charts error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch top apps', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}