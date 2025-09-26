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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/48/e3/52/48e35236-7f87-cc3a-238a-521bfed5618c/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c5/19/20/c5192099-b09b-6230-a7e1-b5272b48568f/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/22/e8/99/22e899be-8107-d5cc-f565-ec43ec6aee1f/AppIcon-0-1x_U007emarketing-0-6-0-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/94/32/c0/9432c02b-b037-06c6-ad0b-326b26f63f06/AppIcon-0-1x_U007emarketing-0-6-0-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/36/e9/4f/36e94f13-6b43-8294-b9f2-7cae377e7055/Prod-0-1x_U007emarketing-0-6-0-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d0/36/5f/d0365ff6-4552-5631-c205-a73b5554ca09/Icon-Production-0-1x_U007emarketing-0-6-0-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/93/6f/20/936f207f-9bcb-da16-0255-2827f4b99979/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/78/8e/20/788e206f-e9a8-c78f-fb1f-5bfc72defd4f/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a1/22/46/a1224610-97a0-a2ba-e2f9-f1ad9f20b4f5/ProductionAppIcon-0-1x_U007emarketing-0-7-0-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d3/b9/e3/d3b9e399-8e41-5152-a4f0-1f5f17a93141/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/09/f0/74/09f07473-eaa3-1765-76c2-42c43f9ad719/logo_youtube_2017_color-0-0-1x_U007emarketing-0-0-0-10-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d7/5e/a4/d75ea431-0a37-f494-56fb-9c7dcef892ba/AppIcon-0-1x_U007emarketing-0-8-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/01/a9/2a/01a92a7f-f1e0-d48f-a87f-bf7906005bf2/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e9/61/94/e9619418-0ae8-0462-3929-778ce3a96703/AppIcon-1x_U007emarketing-0-10-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c9/45/f2/c945f271-ad10-d45e-f07f-b376dc93b79f/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5f/13/d0/5f13d085-6c0e-7ed6-f2f5-76e97fbfccff/AppIcon-0-1x_U007emarketing-0-6-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/39/fb/d4/39fbd4d1-e203-d847-8cf1-66a17bd60d2f/AppIcon-0-0-1x_U007ephone-0-0-0-85-220-0.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bb/16/61/bb16615f-2d97-fb68-ae67-68760ef4f04b/logo_gmail_2020q4_color-0-0-1x_U007emarketing-0-0-0-6-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bf/c2/ab/bfc2ab93-13d7-1278-beb6-ff4d680c8319/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-85-220.png/512x512bb.png',
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
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5f/7a/fa/5f7afae7-b3ac-6d7f-4228-f9e865e12de0/AppIcon-1x_U007emarketing-0-9-0-0-85-220-0.png/512x512bb.png',
        rating: 4.4,
        ratingsCount: 1300000,
        category: 'Business',
        platform: 'both',
        appStoreId: '546505307',
        playStoreId: 'us.zoom.videomeetings',
        description: 'Video conferencing and meetings'
      },
      
      // Shopping & E-commerce
      {
        id: 'amazon',
        name: 'Amazon Shopping',
        developer: 'AMZN Mobile LLC',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9b/9f/31/9b9f315f-3e69-1d87-c3d6-70c949e23e0f/AppIcon-0-1x_U007emarketing-0-10-0-0-GLES2_U002c0-85-220-0.png/512x512bb.png',
        rating: 4.7,
        ratingsCount: 5300000,
        category: 'Shopping',
        platform: 'both',
        appStoreId: '297606951',
        playStoreId: 'com.amazon.mShop.android.shopping',
        description: 'Shop millions of products'
      },
      {
        id: 'ebay',
        name: 'eBay: Buy, sell, and save',
        developer: 'eBay Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/14/9f/e6/149fe65f-6ad3-c4f2-6276-6cb1ecfc87bb/AppIcon-1x_U007emarketing-0-6-0-sRGB-0-85-220-0.png/512x512bb.png',
        rating: 4.8,
        ratingsCount: 1800000,
        category: 'Shopping',
        platform: 'both',
        appStoreId: '282614216',
        playStoreId: 'com.ebay.mobile',
        description: 'Buy and sell anything'
      },
      
      // Finance
      {
        id: 'paypal',
        name: 'PayPal',
        developer: 'PayPal, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1d/36/a6/1d36a6e9-b785-d59f-b1f5-fba33c890f7b/AppIcon-0-1x_U007emarketing-0-6-0-0-85-220.png/512x512bb.png',
        rating: 4.8,
        ratingsCount: 8900000,
        category: 'Finance',
        platform: 'both',
        appStoreId: '283646709',
        playStoreId: 'com.paypal.android.p2pmobile',
        description: 'Send, receive, and manage money'
      },
      {
        id: 'venmo',
        name: 'Venmo',
        developer: 'PayPal, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/04/4f/ad/044fad4e-fdd1-1296-7385-42c670e97a95/AppIcon-0-1x_U007ephone-0-0-0-85-220-0.png/512x512bb.png',
        rating: 4.9,
        ratingsCount: 2400000,
        category: 'Finance',
        platform: 'both',
        appStoreId: '351727428',
        playStoreId: 'com.venmo',
        description: 'Fast, safe, social payments'
      },
      {
        id: 'cashapp',
        name: 'Cash App',
        developer: 'Block, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/dc/f8/a7/dcf8a7e5-1e01-6c0b-14c0-f2de995e1c90/AppIcon-0-1x_U007emarketing-0-6-0-0-sRGB-0-85-220.png/512x512bb.png',
        rating: 4.8,
        ratingsCount: 14100000,
        category: 'Finance',
        platform: 'both',
        appStoreId: '711923939',
        playStoreId: 'com.squareup.cash',
        description: 'Send, spend, bank, and invest'
      },
      
      // Travel & Local
      {
        id: 'uber',
        name: 'Uber - Request a ride',
        developer: 'Uber Technologies, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/05/fd/c1/05fdc115-1fc6-2c77-0a12-3cf0e56e36f9/AppIcon-0-0-1x_U007epad-0-10-0-85-220.png/512x512bb.png',
        rating: 4.3,
        ratingsCount: 9300000,
        category: 'Travel',
        platform: 'both',
        appStoreId: '368677368',
        playStoreId: 'com.ubercab',
        description: 'Request rides on demand'
      },
      {
        id: 'lyft',
        name: 'Lyft',
        developer: 'Lyft, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f6/68/f9/f668f9f3-8c74-5067-2b1d-673f445871d5/PassengerAppIcon-0-1x_U007emarketing-0-7-0-0-85-220-0.png/512x512bb.png',
        rating: 4.8,
        ratingsCount: 1400000,
        category: 'Travel',
        platform: 'both',
        appStoreId: '529379082',
        playStoreId: 'me.lyft.android',
        description: 'Rideshare with Lyft'
      },
      {
        id: 'airbnb',
        name: 'Airbnb',
        developer: 'Airbnb, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9f/d6/00/9fd6004e-4ae4-3f72-94d4-15a99ca31ad5/AppIcon-1x_U007emarketing-0-7-0-0-85-220-0.png/512x512bb.png',
        rating: 4.8,
        ratingsCount: 1600000,
        category: 'Travel',
        platform: 'both',
        appStoreId: '401626263',
        playStoreId: 'com.airbnb.android',
        description: 'Book unique homes & experiences'
      },
      
      // Food & Delivery
      {
        id: 'doordash',
        name: 'DoorDash - Food Delivery',
        developer: 'DoorDash, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/48/1f/a4/481fa442-6e09-0093-e0c6-d8fec554a8f0/AppIcon-1x_U007emarketing-0-6-0-0-85-220-0.png/512x512bb.png',
        rating: 4.7,
        ratingsCount: 2700000,
        category: 'Food & Drink',
        platform: 'both',
        appStoreId: '719972451',
        playStoreId: 'com.dd',
        description: 'Food delivery from restaurants'
      },
      {
        id: 'uber-eats',
        name: 'Uber Eats: Food Delivery',
        developer: 'Uber Technologies, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ec/fd/f8/ecfdf82d-6856-2b4b-ee62-f0d90edd6a6f/AppIcon-0-0-1x_U007epad-0-0-0-85-220.png/512x512bb.png',
        rating: 4.7,
        ratingsCount: 3100000,
        category: 'Food & Drink',
        platform: 'both',
        appStoreId: '1058959277',
        playStoreId: 'com.ubercab.eats',
        description: 'Order food to your door'
      },
      
      // Communication & Business
      {
        id: 'slack',
        name: 'Slack',
        developer: 'Slack Technologies, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4f/42/89/4f4289f1-f2df-e663-5269-1b466e657497/AppIcon-1x_U007emarketing-0-12-0-0-85-220-0.png/512x512bb.png',
        rating: 4.6,
        ratingsCount: 367000,
        category: 'Business',
        platform: 'both',
        appStoreId: '618783545',
        playStoreId: 'com.Slack',
        description: 'Business communication hub'
      },
      {
        id: 'microsoft-teams',
        name: 'Microsoft Teams',
        developer: 'Microsoft Corporation',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5f/ff/42/5fff423f-c99e-5c24-c27a-8acd0a6dbff6/AppIcon-0-1x_U007emarketing-0-7-0-0-85-220-0.png/512x512bb.png',
        rating: 4.5,
        ratingsCount: 714000,
        category: 'Business',
        platform: 'both',
        appStoreId: '1113153706',
        playStoreId: 'com.microsoft.teams',
        description: 'Video meetings and team chat'
      },
      
      // Health & Fitness
      {
        id: 'myfitnesspal',
        name: 'MyFitnessPal',
        developer: 'MyFitnessPal, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4f/e2/9f/4fe29f7f-c3f1-1ec7-5f7d-e0ca97cf86bf/AppIcon-0-1x_U007emarketing-0-10-0-0-85-220-0.png/512x512bb.png',
        rating: 4.7,
        ratingsCount: 1700000,
        category: 'Health & Fitness',
        platform: 'both',
        appStoreId: '341232718',
        playStoreId: 'com.myfitnesspal.android',
        description: 'Calorie counter & diet tracker'
      },
      {
        id: 'strava',
        name: 'Strava: Run, Bike & Swim',
        developer: 'Strava, Inc.',
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/62/4f/cf/624fcf40-cf40-9e40-e420-ac60ab9d8f09/AppIcon-0-1x_U007emarketing-0-6-0-0-85-220-0.png/512x512bb.png',
        rating: 4.6,
        ratingsCount: 394000,
        category: 'Health & Fitness',
        platform: 'both',
        appStoreId: '426826309',
        playStoreId: 'com.strava',
        description: 'Track running, cycling & swimming'
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