import { NextRequest, NextResponse } from 'next/server'
import { appTweakClient } from '@/lib/api/apptweak'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') || '6004' // 6004 is Sports category
  const country = searchParams.get('country') || 'us'
  const platform = searchParams.get('platform') || 'ios'
  const type = searchParams.get('type') || 'free'
  
  console.log('Top charts request:', { category, country, platform, type })
  
  try {
    // For now, use iTunes RSS feeds as they're reliable and free
    // AppTweak integration can be added when API documentation is clearer
    let url = ''
    
    if (platform === 'ios') {
      const genreParam = category !== '0' ? `/genre=${category}` : ''
      url = `https://rss.itunes.apple.com/api/v1/${country}/ios-apps/top-${type}/all/50${genreParam}/explicit.json`
    } else {
      // Android RSS feeds have different structure
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
      total: apps.length
    })
  } catch (error) {
    console.error('Top charts error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch top apps', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}