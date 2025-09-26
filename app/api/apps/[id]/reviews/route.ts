import { NextRequest, NextResponse } from 'next/server'
import { getAppReviewsWithAppTweak } from '@/lib/api/apptweak'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get('platform') || 'ios' // ios or android
  const page = parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sort') || 'recent' // recent, helpful, critical
  
  try {
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
    return NextResponse.json({ 
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}