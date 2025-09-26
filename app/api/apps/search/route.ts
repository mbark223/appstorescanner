import { NextRequest, NextResponse } from 'next/server'
import { App } from '@/types/app'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // For now, return mock data. In production, this would search actual app stores
    const mockApps: App[] = [
      {
        id: '1',
        name: 'WhatsApp Messenger',
        developer: 'WhatsApp LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b7/21/38/b72138f0-9c09-2e7e-15d0-1e6e3a1c1e0f/AppIcon-0-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
        rating: 4.5,
        ratingsCount: 156000000,
        category: 'Social Networking',
        platform: 'both',
        appStoreId: '310633997',
        playStoreId: 'com.whatsapp',
        description: 'Simple. Reliable. Private.'
      },
      {
        id: '2',
        name: 'Instagram',
        developer: 'Instagram, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4e/25/cf/4e25cf02-8b94-3b48-702e-a65dcc1ffb76/Prod-0-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
        rating: 4.6,
        ratingsCount: 142000000,
        category: 'Photo & Video',
        platform: 'both',
        appStoreId: '389801252',
        playStoreId: 'com.instagram.android',
        description: 'Capture and share moments'
      },
      {
        id: '3',
        name: 'TikTok',
        developer: 'TikTok Ltd.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/30/8c/46/308c4635-f26d-01a8-60d8-c91a223f8f86/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.6,
        ratingsCount: 47000000,
        category: 'Entertainment',
        platform: 'both',
        appStoreId: '1235601864',
        playStoreId: 'com.zhiliaoapp.musically',
        description: 'Videos, Music & Live Streams'
      }
    ]

    // Filter based on query
    const filteredApps = mockApps.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.developer.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      apps: filteredApps,
      total: filteredApps.length,
      page: 1,
      pageSize: 20
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search apps' }, { status: 500 })
  }
}