import { NextRequest, NextResponse } from 'next/server'
import { App } from '@/types/app'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // Comprehensive mock data with real app store IDs
    const mockApps: App[] = [
      // Music & Audio
      {
        id: 'spotify',
        name: 'Spotify - Music and Podcasts',
        developer: 'Spotify AB',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/28/21/aa/2821aa0b-6c77-49a5-9ad0-9bab0ad87de9/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.8,
        ratingsCount: 27300000,
        category: 'Music',
        platform: 'both',
        appStoreId: '324684580',
        playStoreId: 'com.spotify.music',
        description: 'Listen to millions of songs and podcasts'
      },
      {
        id: 'apple-music',
        name: 'Apple Music',
        developer: 'Apple',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a0/a6/df/a0a6df00-7c6c-de8f-4e76-492b4a0e9851/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.5,
        ratingsCount: 2400000,
        category: 'Music',
        platform: 'both',
        appStoreId: '1108187390',
        playStoreId: 'com.apple.android.music',
        description: 'Stream over 100 million songs'
      },
      {
        id: 'pandora',
        name: 'Pandora Music & Podcasts',
        developer: 'Pandora Media, LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/ee/84/4f/ee844f6a-3a9b-9b89-b9b0-8b28f4c60c6f/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.4,
        ratingsCount: 1800000,
        category: 'Music',
        platform: 'both',
        appStoreId: '284035177',
        playStoreId: 'com.pandora.android',
        description: 'Personalized music and podcast experience'
      },
      
      // Social Media
      {
        id: 'whatsapp',
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
        id: 'instagram',
        name: 'Instagram',
        developer: 'Instagram, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/4d/4f/a8/4d4fa86e-2f8a-39b7-3e8f-f14e0962eae4/Prod-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.6,
        ratingsCount: 142000000,
        category: 'Photo & Video',
        platform: 'both',
        appStoreId: '389801252',
        playStoreId: 'com.instagram.android',
        description: 'Capture and share moments'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        developer: 'Meta Platforms, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3d/16/68/3d16687f-5bda-c251-ffb5-d641e96d422a/Icon-Production-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.1,
        ratingsCount: 11400000,
        category: 'Social Networking',
        platform: 'both',
        appStoreId: '284882215',
        playStoreId: 'com.facebook.katana',
        description: 'Connect with friends and the world'
      },
      {
        id: 'tiktok',
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
      },
      {
        id: 'snapchat',
        name: 'Snapchat',
        developer: 'Snap, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/63/60/66/636066d4-e4c0-de42-412f-ccccd9deb2f3/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.4,
        ratingsCount: 11900000,
        category: 'Photo & Video',
        platform: 'both',
        appStoreId: '447188370',
        playStoreId: 'com.snapchat.android',
        description: 'Share the moment'
      },
      {
        id: 'twitter',
        name: 'X (formerly Twitter)',
        developer: 'X Corp.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/5e/b7/34/5eb73496-40d4-7fc4-1a7b-6c7d87f42cd0/ProductionAppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.2,
        ratingsCount: 5800000,
        category: 'News',
        platform: 'both',
        appStoreId: '333903271',
        playStoreId: 'com.twitter.android',
        description: 'Connect and share your thoughts'
      },
      
      // Entertainment & Streaming
      {
        id: 'netflix',
        name: 'Netflix',
        developer: 'Netflix, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c3/5b/22/c35b22b1-7c9e-ab64-e864-067c6ff7be7e/AppIcon-0-0-1x_U007epad-0-0-0-85-220.png/512x512bb.png',
        rating: 4.4,
        ratingsCount: 13100000,
        category: 'Entertainment',
        platform: 'both',
        appStoreId: '363590051',
        playStoreId: 'com.netflix.mediaclient',
        description: 'Watch TV shows & movies'
      },
      {
        id: 'youtube',
        name: 'YouTube',
        developer: 'Google LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/09/96/99/09969924-8657-e764-2634-01c5c5423be8/logo_youtube_2017_color-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.6,
        ratingsCount: 46100000,
        category: 'Photo & Video',
        platform: 'both',
        appStoreId: '544007664',
        playStoreId: 'com.google.android.youtube',
        description: 'Watch, upload and share videos'
      },
      {
        id: 'disney-plus',
        name: 'Disney+',
        developer: 'Disney',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/8e/1b/12/8e1b125f-c45f-c4d6-4c10-0ac966faf136/AppIcon-1x_U007emarketing-0-7-0-0-85-220-0.png/512x512bb.png',
        rating: 4.5,
        ratingsCount: 2800000,
        category: 'Entertainment',
        platform: 'both',
        appStoreId: '1446075923',
        playStoreId: 'com.disney.disneyplus',
        description: 'Disney, Marvel, Star Wars & more'
      },
      {
        id: 'hbo-max',
        name: 'Max: Stream HBO, TV, & Movies',
        developer: 'WarnerMedia',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/83/19/86/8319869e-bc75-9a57-9e93-3a6cb91c2e78/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.1,
        ratingsCount: 1100000,
        category: 'Entertainment',
        platform: 'both',
        appStoreId: '1666653815',
        playStoreId: 'com.wbd.stream',
        description: 'Stream HBO, hit series & movies'
      },
      {
        id: 'amazon-prime-video',
        name: 'Amazon Prime Video',
        developer: 'AMZN Mobile LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/d1/5b/e8/d15be883-c034-f738-1e5f-b6c89c524e33/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.2,
        ratingsCount: 1900000,
        category: 'Entertainment',
        platform: 'both',
        appStoreId: '545519333',
        playStoreId: 'com.amazon.avod.thirdpartyclient',
        description: 'Watch movies, TV shows & sports'
      },
      
      // Gaming
      {
        id: 'minecraft',
        name: 'Minecraft',
        developer: 'Mojang',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/4f/d6/b9/4fd6b9f5-c9e3-e250-7c5f-4f9c9d0d5e4a/AppIcon-0-0-1x_U007emarketing-0-0-0-9-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.5,
        ratingsCount: 4600000,
        category: 'Games',
        platform: 'both',
        appStoreId: '479516143',
        playStoreId: 'com.mojang.minecraftpe',
        description: 'Create, explore and survive'
      },
      {
        id: 'roblox',
        name: 'Roblox',
        developer: 'Roblox Corporation',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/6f/06/4e/6f064e00-ba65-6bb8-7b13-5dacf0320bb8/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.4,
        ratingsCount: 5100000,
        category: 'Games',
        platform: 'both',
        appStoreId: '431946152',
        playStoreId: 'com.roblox.client',
        description: 'Imagine, create, and play together'
      },
      {
        id: 'among-us',
        name: 'Among Us!',
        developer: 'InnerSloth LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/72/fb/67/72fb6770-e28f-8de6-b5d1-c5b9a7e45fb1/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.3,
        ratingsCount: 1300000,
        category: 'Games',
        platform: 'both',
        appStoreId: '1351168404',
        playStoreId: 'com.innersloth.spacemafia',
        description: 'Play online or local WiFi'
      },
      
      // Productivity & Utilities
      {
        id: 'gmail',
        name: 'Gmail',
        developer: 'Google LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c3/73/60/c3736036-9209-d3dd-cf14-8ec69e5c5c0f/logo_gmail_2020q4_color-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.5,
        ratingsCount: 8200000,
        category: 'Productivity',
        platform: 'both',
        appStoreId: '422689480',
        playStoreId: 'com.google.android.gm',
        description: 'Email by Google'
      },
      {
        id: 'google-drive',
        name: 'Google Drive',
        developer: 'Google LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/27/76/e3/2776e390-d42a-b82f-3d5d-ff96cf469185/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
        rating: 4.7,
        ratingsCount: 2300000,
        category: 'Productivity',
        platform: 'both',
        appStoreId: '507874739',
        playStoreId: 'com.google.android.apps.docs',
        description: 'Cloud storage and file backup'
      },
      {
        id: 'zoom',
        name: 'Zoom',
        developer: 'Zoom Video Communications, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/08/05/e6/0805e692-b8b5-982f-beef-3eb332e61031/AppIcon-0-0-1x_U007ephone-0-1-0-85-220.png/512x512bb.png',
        rating: 4.4,
        ratingsCount: 1300000,
        category: 'Business',
        platform: 'both',
        appStoreId: '546505307',
        playStoreId: 'us.zoom.videomeetings',
        description: 'Video conferencing and meetings'
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