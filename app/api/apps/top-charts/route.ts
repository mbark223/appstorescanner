import { NextRequest, NextResponse } from 'next/server'
import { appTweakClient } from '@/lib/api/apptweak'
import { App } from '@/types/app'

// Sample data for when APIs fail
function getSampleApps(type: string, platform: string, category: string): any[] {
  const sampleSportsApps = [
    {
      id: 'sample-1',
      name: 'ESPN: Live Sports & Scores',
      developer: 'ESPN',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e0/8f/00/e08f0051-6e76-6d4f-4b56-3f5c5f5c5f5c/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
      rating: 4.7,
      ratingsCount: 523000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: 'sample-1',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 1
    },
    {
      id: 'sample-2', 
      name: 'The Athletic: Sports News',
      developer: 'The Athletic Media Company',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/43/c4/c4/43c4c4dd-e33d-104e-ac1c-a6d7275aa773/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg',
      rating: 4.8,
      ratingsCount: 42000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: 'sample-2',
      price: type === 'paid' ? '$1.99' : 'Free',
      rank: 2
    },
    {
      id: 'sample-3',
      name: 'Yahoo Sports',
      developer: 'Yahoo',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/30/7f/00/307f0051-6e76-6d4f-4b56-3f5c5f5c5f5c/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
      rating: 4.5,
      ratingsCount: 89000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: 'sample-3',
      price: type === 'paid' ? '$2.99' : 'Free',
      rank: 3
    }
  ]
  
  return sampleSportsApps
}

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
          stack: appTweakError instanceof Error ? appTweakError.stack : undefined,
          type: appTweakError instanceof Error ? appTweakError.constructor.name : typeof appTweakError
        })
        console.log('Falling back to RSS feeds...')
        // Don't throw, continue to RSS fallback
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
    
    if (!response.ok) {
      console.error('RSS feed error:', response.status, response.statusText)
      throw new Error(`RSS feed returned ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('RSS feed returned non-JSON content:', contentType)
      throw new Error('RSS feed returned non-JSON content')
    }
    
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
    console.error('Top charts critical error:', error)
    
    // Return sample data when both APIs fail
    const sampleApps = getSampleApps(type, platform, category)
    
    return NextResponse.json({
      apps: sampleApps,
      category,
      country,
      platform,
      type,
      total: sampleApps.length,
      source: 'sample',
      error: {
        message: 'Using sample data due to API issues',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}