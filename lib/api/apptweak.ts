import { App, Review } from '@/types/app'

const APPTWEAK_API_BASE = 'https://api.apptweak.com'

interface AppTweakApp {
  id: string
  slug: string
  name: string
  subtitle?: string
  description?: string
  developer: {
    name: string
    id: string
  }
  icon: string
  rating: {
    average: number
    count: number
    histogram: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  category: {
    name: string
    id: string
  }
  price?: {
    value: number
    currency: string
  }
  in_app_purchases?: boolean
  languages?: string[]
  screenshots?: string[]
  release_date?: string
  last_update?: string
  version?: string
  size?: string
  content_rating?: string
}

interface AppTweakReview {
  id: string
  author: string
  date: string
  rating: number
  title: string
  body: string
  version?: string
  country: string
  language: string
  developer_reply?: {
    date: string
    body: string
  }
}

class AppTweakClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${APPTWEAK_API_BASE}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(url.toString(), {
      headers: {
        'X-Apptweak-Key': this.apiKey,
        'Accept': 'application/json'
      },
      // Cache for 1 hour
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`AppTweak API error (${response.status}): ${error}`)
    }

    return response.json()
  }

  // Search for apps
  async searchApps(
    query: string, 
    platform: 'ios' | 'android' = 'ios',
    country: string = 'us',
    limit: number = 50
  ): Promise<App[]> {
    try {
      const endpoint = platform === 'ios' 
        ? '/ios/searches.json' 
        : '/android/searches.json'
      
      const data = await this.request(endpoint, {
        term: query,
        country: country,
        language: 'en',
        device: platform === 'ios' ? 'iphone' : 'phone',
        num: limit
      })

      return (data.content || []).map((app: any) => this.convertToApp(app, platform))
    } catch (error) {
      console.error('AppTweak search error:', error)
      return []
    }
  }

  // Get app details
  async getAppDetails(
    appId: string,
    platform: 'ios' | 'android' = 'ios',
    country: string = 'us'
  ): Promise<App | null> {
    try {
      const endpoint = platform === 'ios'
        ? `/ios/applications/${appId}.json`
        : `/android/applications/${appId}.json`
      
      const data = await this.request(endpoint, {
        country: country,
        language: 'en',
        device: platform === 'ios' ? 'iphone' : 'phone'
      })

      return this.convertToApp(data.content, platform)
    } catch (error) {
      console.error('AppTweak app details error:', error)
      return null
    }
  }

  // Get app reviews
  async getAppReviews(
    appId: string,
    platform: 'ios' | 'android' = 'ios',
    country: string = 'us',
    sort: 'recent' | 'helpful' | 'critical' = 'recent',
    page: number = 1
  ): Promise<{ reviews: Review[], total: number, hasMore: boolean }> {
    try {
      const endpoint = platform === 'ios'
        ? `/ios/applications/${appId}/reviews.json`
        : `/android/applications/${appId}/reviews.json`
      
      const sortMap = {
        recent: 'date',
        helpful: 'usefulness', 
        critical: 'rating_asc'
      }
      
      const data = await this.request(endpoint, {
        country: country,
        language: 'en',
        sort_by: sortMap[sort],
        page: page,
        per_page: 50
      })

      const reviews = (data.content || []).map((review: AppTweakReview) => 
        this.convertToReview(review, appId, platform)
      )

      return {
        reviews,
        total: data.metadata?.total || reviews.length,
        hasMore: data.metadata?.has_next_page || false
      }
    } catch (error) {
      console.error('AppTweak reviews error:', error)
      return { reviews: [], total: 0, hasMore: false }
    }
  }

  // Get top apps by category
  async getTopApps(
    category: string,
    platform: 'ios' | 'android' = 'ios',
    country: string = 'us',
    type: 'free' | 'paid' | 'grossing' = 'free'
  ): Promise<App[]> {
    try {
      const endpoint = platform === 'ios'
        ? `/ios/rankings/top-charts.json`
        : `/android/rankings/top-charts.json`
      
      const data = await this.request(endpoint, {
        country: country,
        category: category,
        list_type: type,
        device: platform === 'ios' ? 'iphone' : 'phone'
      })

      return (data.content || []).map((app: any) => this.convertToApp(app, platform))
    } catch (error) {
      console.error('AppTweak top apps error:', error)
      return []
    }
  }

  // Get app keywords and ASO data
  async getAppKeywords(
    appId: string,
    platform: 'ios' | 'android' = 'ios',
    country: string = 'us'
  ) {
    try {
      const endpoint = platform === 'ios'
        ? `/ios/applications/${appId}/keywords.json`
        : `/android/applications/${appId}/keywords.json`
      
      const data = await this.request(endpoint, {
        country: country,
        language: 'en'
      })

      return data.content || []
    } catch (error) {
      console.error('AppTweak keywords error:', error)
      return []
    }
  }

  // Convert AppTweak app format to our App format
  private convertToApp(atApp: any, platform: 'ios' | 'android'): App {
    return {
      id: atApp.id || atApp.slug,
      name: atApp.name || atApp.title,
      developer: typeof atApp.developer === 'string' ? atApp.developer : atApp.developer?.name || '',
      icon: atApp.icon || atApp.artwork_url || '',
      rating: atApp.rating?.average || atApp.rating || 0,
      ratingsCount: atApp.rating?.count || atApp.ratings_count || 0,
      category: atApp.category?.name || atApp.category || 'Other',
      platform: platform,
      appStoreId: platform === 'ios' ? (atApp.id || atApp.slug) : undefined,
      playStoreId: platform === 'android' ? (atApp.id || atApp.slug) : undefined,
      description: atApp.description || atApp.summary || '',
      lastUpdated: atApp.last_update ? new Date(atApp.last_update) : undefined
    }
  }

  // Convert AppTweak review format to our Review format
  private convertToReview(
    atReview: AppTweakReview, 
    appId: string, 
    platform: 'ios' | 'android'
  ): Review {
    return {
      id: atReview.id,
      appId: appId,
      platform: platform,
      rating: atReview.rating,
      title: atReview.title || '',
      content: atReview.body || '',
      author: atReview.author,
      date: new Date(atReview.date),
      helpful: 0, // AppTweak doesn't provide this
      version: atReview.version,
      response: atReview.developer_reply?.body,
      responseDate: atReview.developer_reply?.date 
        ? new Date(atReview.developer_reply.date) 
        : undefined
    }
  }
}

// Create and export client instance
export const appTweakClient = new AppTweakClient(
  process.env.APPTWEAK_API_KEY || ''
)

// Export convenience functions
export async function searchAppsWithAppTweak(
  query: string,
  options?: {
    platform?: 'ios' | 'android' | 'both'
    country?: string
    limit?: number
  }
) {
  const { platform = 'both', country = 'us', limit = 50 } = options || {}
  
  if (platform === 'both') {
    const [iosApps, androidApps] = await Promise.all([
      appTweakClient.searchApps(query, 'ios', country, limit),
      appTweakClient.searchApps(query, 'android', country, limit)
    ])
    
    // Merge and deduplicate
    const allApps = [...iosApps, ...androidApps]
    const appMap = new Map<string, App>()
    
    allApps.forEach(app => {
      const key = `${app.name.toLowerCase()}-${app.developer.toLowerCase()}`
      const existing = appMap.get(key)
      
      if (existing) {
        appMap.set(key, {
          ...existing,
          platform: 'both' as const,
          appStoreId: existing.appStoreId || app.appStoreId,
          playStoreId: existing.playStoreId || app.playStoreId,
          rating: Math.max(existing.rating, app.rating),
          ratingsCount: Math.max(existing.ratingsCount, app.ratingsCount)
        })
      } else {
        appMap.set(key, app)
      }
    })
    
    return Array.from(appMap.values())
  }
  
  return appTweakClient.searchApps(query, platform, country, limit)
}

export async function getAppDetailsWithAppTweak(
  appId: string,
  platform: 'ios' | 'android' = 'ios',
  country: string = 'us'
) {
  return appTweakClient.getAppDetails(appId, platform, country)
}

export async function getAppReviewsWithAppTweak(
  appId: string,
  options?: {
    platform?: 'ios' | 'android'
    country?: string
    sort?: 'recent' | 'helpful' | 'critical'
    page?: number
  }
) {
  const { platform = 'ios', country = 'us', sort = 'recent', page = 1 } = options || {}
  return appTweakClient.getAppReviews(appId, platform, country, sort, page)
}