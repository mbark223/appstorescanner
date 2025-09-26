import { NextResponse } from 'next/server'
import { App } from '@/types/app'

// Popular sports apps to fetch
const SPORTS_APPS = [
  { name: 'ESPN', id: '317469184' },
  { name: 'FanDuel Sportsbook', id: '1413609906' },
  { name: 'DraftKings Sportsbook', id: '1413745102' },
  { name: 'BetMGM', id: '1497912156' },
  { name: 'Caesars Sportsbook', id: '1514142852' },
  { name: 'theScore', id: '285692706' },
  { name: 'Yahoo Fantasy Sports', id: '328412701' },
  { name: 'Sleeper', id: '987367543' },
  { name: 'The Athletic', id: '1135216317' },
  { name: 'Bleacher Report', id: '418075935' },
  { name: 'NBC Sports', id: '542511686' },
  { name: 'FOX Sports', id: '493994568' },
  { name: 'NBA', id: '463313018' },
  { name: 'NFL', id: '389879576' },
  { name: 'MLB', id: '493619333' },
  { name: 'NHL', id: '463313331' },
  { name: 'UFC', id: '987032359' },
  { name: 'Betr Sportsbook', id: '1641577433' },
  { name: 'Underdog Fantasy', id: '1495946115' },
  { name: 'PrizePicks', id: '1065889359' },
  { name: 'PGA TOUR', id: '401505088' },
  { name: 'NASCAR', id: '552764786' },
  { name: 'CBS Sports', id: '297085214' },
  { name: 'Barstool Sports', id: '1108828608' },
  { name: 'Action Network', id: '1220775168' },
  { name: 'SofaScore', id: '1176147574' },
  { name: 'FlashScore', id: '766670752' },
  { name: 'Odds Shark', id: '951364600' },
  { name: 'Sports Illustrated', id: '377818688' },
  { name: 'DAZN', id: '1129523388' },
  { name: 'ESPN Player', id: '1348268147' },
  { name: 'Fox Bet', id: '1477234386' },
  { name: 'PointsBet', id: '1483456006' },
  { name: 'BetRivers', id: '1442851613' },
  { name: 'Hard Rock Bet', id: '6449370763' },
  { name: 'Fanatics Sportsbook', id: '1642682630' },
  { name: 'bet365', id: '1493994622' },
  { name: 'Tipico', id: '1461073537' },
  { name: 'SuperBook', id: '1517219761' },
  { name: 'MaximBet', id: '1520377421' }
]

export async function GET() {
  try {
    // Fetch all apps in parallel
    const appPromises = SPORTS_APPS.map(async ({ id }) => {
      try {
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${id}&country=us`
        )
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          const itunesApp = data.results[0]
          
          // Convert iTunes format to our App format
          const app: App = {
            id: itunesApp.trackId.toString(),
            name: itunesApp.trackName,
            developer: itunesApp.artistName,
            icon: itunesApp.artworkUrl512 || itunesApp.artworkUrl100,
            rating: itunesApp.averageUserRating || 0,
            ratingsCount: itunesApp.userRatingCount || 0,
            category: itunesApp.primaryGenreName || 'Sports',
            platform: 'ios',
            appStoreId: itunesApp.trackId.toString(),
            description: itunesApp.description || '',
            lastUpdated: itunesApp.currentVersionReleaseDate 
              ? new Date(itunesApp.currentVersionReleaseDate)
              : undefined
          }
          
          return app
        }
        return null
      } catch (error) {
        console.error(`Failed to fetch app ${id}:`, error)
        return null
      }
    })
    
    const results = await Promise.all(appPromises)
    const apps = results.filter(app => app !== null) as App[]
    
    // Sort by rating count (popularity)
    apps.sort((a, b) => b.ratingsCount - a.ratingsCount)
    
    return NextResponse.json({
      apps: apps,
      total: apps.length,
      source: 'itunes'
    })
  } catch (error) {
    console.error('Top sports error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch sports apps', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}