import { NextRequest, NextResponse } from 'next/server'
import { getAppReviewsWithAppTweak } from '@/lib/api/apptweak'
import { Review } from '@/types/app'

// Mock reviews for sports betting apps
function getMockReviews(appId: string, sort: string): Review[] {
  const sportsBettingApps = ['1524374323', '1413609906', '1491281423', '1495752656']
  
  if (appId === '1524374323') { // Caesars Sportsbook
    const caesarsReviews: Review[] = [
      {
        id: '1',
        appId: '1524374323',
        platform: 'ios',
        author: 'SportsGambler23',
        rating: 5,
        title: 'Best sportsbook experience!',
        content: 'Caesars has the best odds and promotions. The app is super smooth and reliable. Love the live betting features and instant payouts. Customer service is excellent too. Highly recommend!',
        date: new Date('2024-01-15'),
        helpful: 234,
        version: '5.12.0'
      },
      {
        id: '2',
        appId: '1524374323',
        platform: 'ios',
        author: 'BettingPro88',
        rating: 5,
        title: 'Amazing bonuses and smooth app',
        content: 'The welcome bonus was incredible! App never crashes and the live betting is lightning fast. Great selection of sports and bet types. Withdrawals are quick and easy.',
        date: new Date('2024-01-10'),
        helpful: 187,
        version: '5.12.0'
      },
      {
        id: '3',
        appId: '1524374323',
        platform: 'ios',
        author: 'CasinoKing',
        rating: 5,
        title: 'Top tier betting platform',
        content: 'Been using multiple sportsbooks and Caesars is definitely the best. Great odds, tons of promotions, and the app is very intuitive. The casino section is fantastic too!',
        date: new Date('2024-01-08'),
        helpful: 156,
        version: '5.11.0'
      },
      {
        id: '4',
        appId: '1524374323',
        platform: 'ios',
        author: 'NFLFanatic',
        rating: 5,
        title: 'Perfect for NFL betting',
        content: 'Outstanding app for football betting. Live stats, great parlays, and the cash out feature saved me multiple times. Interface is clean and easy to navigate.',
        date: new Date('2024-01-05'),
        helpful: 142,
        version: '5.11.0'
      },
      {
        id: '5',
        appId: '1524374323',
        platform: 'ios',
        author: 'LuckyStreak77',
        rating: 5,
        title: 'Reliable and rewarding',
        content: 'Love the daily odds boosts and the rewards program is amazing. App performance is excellent - never had any issues during big games. Highly recommended!',
        date: new Date('2024-01-03'),
        helpful: 128,
        version: '5.11.0'
      },
      {
        id: '6',
        appId: '1524374323',
        platform: 'ios',
        author: 'WeekendWarrior',
        rating: 4,
        title: 'Good app with minor issues',
        content: 'Generally a solid betting app with good odds. Sometimes the app is a bit slow during peak hours but overall satisfied with the experience.',
        date: new Date('2024-01-02'),
        helpful: 89,
        version: '5.11.0'
      },
      {
        id: '7',
        appId: '1524374323',
        platform: 'ios',
        author: 'TechSavvy2024',
        rating: 3,
        title: 'Decent but needs improvements',
        content: 'The betting options are good but the app could use some UI improvements. Sometimes hard to find specific bets. Customer support response time could be better.',
        date: new Date('2023-12-28'),
        helpful: 67,
        version: '5.10.0'
      },
      {
        id: '8',
        appId: '1524374323',
        platform: 'ios',
        author: 'FrustratedUser99',
        rating: 1,
        title: 'Terrible verification process',
        content: 'Been trying to verify my account for weeks. Customer service is unhelpful and keeps asking for the same documents. Can\'t withdraw my winnings. Very disappointed!',
        date: new Date('2023-12-25'),
        helpful: 145,
        version: '5.10.0',
        response: 'We apologize for the inconvenience. Please contact our support team directly at support@caesars.com with your account details so we can resolve this issue promptly.',
        responseDate: new Date('2023-12-26')
      },
      {
        id: '9',
        appId: '1524374323',
        platform: 'ios',
        author: 'GlitchHunter',
        rating: 1,
        title: 'App crashes constantly',
        content: 'The app crashes every time I try to place a live bet. Lost multiple betting opportunities because of this. Fix your app!',
        date: new Date('2023-12-20'),
        helpful: 98,
        version: '5.10.0'
      },
      {
        id: '10',
        appId: '1524374323',
        platform: 'ios',
        author: 'DisappointedBettor',
        rating: 2,
        title: 'Used to be good',
        content: 'The app was great but recent updates made it worse. Slower loading times and the new interface is confusing. Bring back the old version!',
        date: new Date('2023-12-18'),
        helpful: 76,
        version: '5.10.0'
      },
      {
        id: '11',
        appId: '1524374323',
        platform: 'ios',
        author: 'AngryCustomer123',
        rating: 1,
        title: 'Worst customer service ever',
        content: 'Waited 3 hours on chat support and they couldn\'t resolve my issue. Phone support hung up on me. Absolutely terrible experience. Moving to another sportsbook.',
        date: new Date('2023-12-15'),
        helpful: 112,
        version: '5.9.0',
        response: 'We sincerely apologize for your poor experience. This is not the level of service we strive for. Please email vipsupport@caesars.com so our management team can address your concerns.',
        responseDate: new Date('2023-12-16')
      },
      {
        id: '12',
        appId: '1524374323',
        platform: 'ios',
        author: 'MoneyLost2023',
        rating: 1,
        title: 'Scam - they don\'t pay out',
        content: 'Won a big parlay and they voided it for no reason. When I complained they limited my account. Stay away from this scam!',
        date: new Date('2023-12-10'),
        helpful: 134,
        version: '5.9.0'
      }
    ]
    
    // Sort reviews based on sort parameter
    if (sort === 'helpful') {
      return caesarsReviews.sort((a, b) => b.helpful - a.helpful)
    } else if (sort === 'critical') {
      return caesarsReviews.sort((a, b) => a.rating - b.rating)
    }
    return caesarsReviews // recent by default
  }
  
  // Return empty array for other apps (they'll use real API)
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get('platform') || 'ios' // ios or android
  const page = parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sort') || 'recent' // recent, helpful, critical
  
  try {
    // First check if we have mock reviews for this app
    const mockReviews = getMockReviews(params.id, sort)
    if (mockReviews.length > 0) {
      // Paginate mock reviews
      const pageSize = 10
      const startIndex = (page - 1) * pageSize
      const paginatedReviews = mockReviews.slice(startIndex, startIndex + pageSize)
      
      return NextResponse.json({
        reviews: paginatedReviews,
        total: mockReviews.length,
        platform,
        page,
        hasMore: startIndex + pageSize < mockReviews.length
      })
    }
    
    // Otherwise try AppTweak API
    const result = await getAppReviewsWithAppTweak(params.id, {
      platform: platform as 'ios' | 'android',
      country: 'us',
      sort: sort as 'recent' | 'helpful' | 'critical',
      page: page
    })
    
    return NextResponse.json({
      reviews: result.reviews,
      total: result.total,
      platform,
      page,
      hasMore: result.hasMore
    })
  } catch (error) {
    console.error('Review fetch error:', error)
    // Return empty reviews instead of error
    return NextResponse.json({
      reviews: [],
      total: 0,
      platform,
      page,
      hasMore: false
    })
  }
}