import { NextRequest, NextResponse } from 'next/server'
import { appTweakClient } from '@/lib/api/apptweak'
import { App } from '@/types/app'

// Sample data for when APIs fail
function getSampleApps(type: string, platform: string, category: string): any[] {
  const sampleSportsApps = [
    {
      id: '1524374323',
      name: 'Caesars Sportsbook & Casino',
      developer: 'Caesars Entertainment',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/87/74/38/877438a5-f498-c7c9-c6f9-a66c604c0b26/AppIcon-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
      rating: 4.7,
      ratingsCount: 280000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '1524374323',
      playStoreId: 'com.williamhill.us.nj.sports',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 1
    },
    {
      id: '1413609906',
      name: 'FanDuel Sportsbook & Casino',
      developer: 'FanDuel Inc.',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d7/08/0f/d7080f3e-0e62-2319-7527-12ea99dc44fb/AppIcon-0-1x_U007emarketing-0-7-0-0-0-85-220-0.png/512x512bb.png',
      rating: 4.8,
      ratingsCount: 1300000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '1413609906',
      playStoreId: 'com.fanduel.sportsbook',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 2
    },
    {
      id: '1491281423',
      name: 'DraftKings Sportsbook & Casino',
      developer: 'DraftKings Inc.',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e4/20/f8/e420f8d8-e6f1-c4f9-7dc3-6f3325cdfa19/AppIcon-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
      rating: 4.8,
      ratingsCount: 1800000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '1491281423',
      playStoreId: 'com.draftkings.sportsbook',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 3
    },
    {
      id: '1495752656',
      name: 'BetMGM Sportsbook & Casino',
      developer: 'BetMGM, LLC',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/52/c0/de/52c0de09-58aa-b05d-af40-e690cfea1d9f/AppIconProd-1x_U007emarketing-0-5-0-85-220-0.png/512x512bb.png',
      rating: 4.8,
      ratingsCount: 470000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '1495752656',
      playStoreId: 'com.betmgm.sportsbook.nj',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 4
    },
    {
      id: '317469184',
      name: 'ESPN: Live Sports & Scores',
      developer: 'ESPN',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ae/c8/f9/aec8f91f-a37f-3743-1708-7f11d62e1078/AppIcon-1x_U007emarketing-0-6-0-0-85-220-0.png/512x512bb.png',
      rating: 4.7,
      ratingsCount: 2100000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '317469184',
      playStoreId: 'com.espn.score_center',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 5
    },
    {
      id: '1479516328',
      name: 'BetRivers Sportsbook & Casino',
      developer: 'Rush Street Interactive',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/88/e5/05/88e5050d-e889-c87f-3d48-db9b92ad9834/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
      rating: 4.7,
      ratingsCount: 110000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '1479516328',
      playStoreId: 'com.rushstreetinteractive.betrivers',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 6
    },
    {
      id: '286058814',
      name: 'Yahoo Sports: Scores & News',
      developer: 'Yahoo',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/21/82/12/218212e3-e84b-5b6b-a3a6-dbba956667e8/YahooSports-0-1x_U007emarketing-0-10-0-85-220-0.png/512x512bb.png',
      rating: 4.7,
      ratingsCount: 418000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '286058814',
      playStoreId: 'com.yahoo.mobile.client.android.sportacular',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 7
    },
    {
      id: '285692706',
      name: 'theScore: Sports News & Scores',
      developer: 'theScore, Inc.',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/50/77/24/5077249c-e9d6-2c90-9bc7-5cf97a5d7b9f/AppIcon-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
      rating: 4.8,
      ratingsCount: 487000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '285692706',
      playStoreId: 'com.fivemobile.thescore',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 8
    },
    {
      id: '987367543',
      name: 'Sleeper - Fantasy Sports',
      developer: 'Sleeper Sports Inc.',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/8e/d2/f2/8ed2f2d2-7b87-e823-2ab9-5ad8da2cf18a/AppIcon-1x_U007emarketing-0-7-0-0-85-220-0.png/512x512bb.png',
      rating: 4.8,
      ratingsCount: 324000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '987367543',
      playStoreId: 'com.sleeperbot',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 9
    },
    {
      id: '1484638310',
      name: 'PointsBet Sportsbook',
      developer: 'PointsBet',
      icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d0/08/d5/d008d50f-ae4d-9e7e-f6f5-e28ddce5e8c7/AppIcon-0-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
      rating: 4.6,
      ratingsCount: 73000,
      category: 'Sports',
      platform: platform as 'ios' | 'android',
      appStoreId: '1484638310',
      playStoreId: 'com.pointsbet.sportsbook',
      price: type === 'paid' ? '$0.99' : 'Free',
      rank: 10
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