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

    console.log('AppTweak API Request:', url.toString())

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
      console.error('AppTweak API Error:', response.status, error)
      throw new Error(`AppTweak API error (${response.status}): ${error}`)
    }

    const data = await response.json()
    console.log('AppTweak API Response:', data)
    return data
  }

  // Search for apps
  async searchApps(
    query: string, 
    platform: 'ios' | 'android' = 'ios',
    country: string = 'us',
    limit: number = 50
  ): Promise<App[]> {
    try {
      // AppTweak v3 API endpoints
      const endpoint = platform === 'ios' 
        ? `/ios/applications.json` 
        : `/android/applications.json`
      
      const data = await this.request(endpoint, {
        q: query,
        country: country,
        language: 'en',
        device: platform === 'ios' ? 'iphone' : 'phone'
      })

      // If no results, try alternative endpoint
      if (!data.content || data.content.length === 0) {
        console.log('Trying alternative search endpoint...')
        const altEndpoint = platform === 'ios' 
          ? '/ios/search.json' 
          : '/android/search.json'
        
        const altData = await this.request(altEndpoint, {
          term: query,
          country: country,
          num: limit
        })
        
        return (altData.results || altData.content || []).map((app: any) => this.convertToApp(app, platform))
      }

      return (data.content || data.results || []).slice(0, limit).map((app: any) => this.convertToApp(app, platform))
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
      // For now, fallback to searching for popular sports apps
      // AppTweak rankings endpoint might require different parameters
      const sportsApps = [
        'FanDuel', 'DraftKings', 'ESPN', 'theScore', 'Caesars Sportsbook',
        'BetMGM', 'Underdog Fantasy', 'Betr', 'Sleeper', 'Yahoo Fantasy',
        'CBS Sports', 'The Athletic', 'Bleacher Report', 'NBA', 'NFL',
        'MLB', 'NHL', 'UFC', 'PGA TOUR', 'NASCAR'
      ]
      
      // Search for each app
      const allApps: App[] = []
      for (const appName of sportsApps) {
        try {
          const results = await this.searchApps(appName, platform, country, 5)
          if (results.length > 0) {
            allApps.push(results[0]) // Take the first result
          }
        } catch (e) {
          console.log(`Failed to search for ${appName}`)
        }
      }
      
      return allApps
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
    console.log('Converting app:', atApp.name || atApp.title, atApp)
    
    // Handle different AppTweak response formats
    const appId = atApp.id || atApp.app_id || atApp.slug || atApp.track_id
    const name = atApp.name || atApp.title || atApp.track_name || ''
    const icon = atApp.icon || atApp.icon_url || atApp.artwork_url || atApp.artwork_url_100 || atApp.artwork_url_512 || ''
    const developer = atApp.developer || atApp.developer_name || atApp.artist_name || 
                     (typeof atApp.developer === 'object' ? atApp.developer?.name : '') || ''
    const rating = atApp.rating?.average || atApp.rating || atApp.average_user_rating || 
                   atApp.average_user_rating_for_current_version || 0
    const ratingsCount = atApp.rating?.count || atApp.ratings_count || atApp.user_rating_count || 
                         atApp.user_rating_count_for_current_version || 0
    
    return {
      id: String(appId),
      name: name,
      developer: developer,
      icon: icon,
      rating: Number(rating) || 0,
      ratingsCount: Number(ratingsCount) || 0,
      category: atApp.category?.name || atApp.category || atApp.primary_genre_name || 'Other',
      platform: platform,
      appStoreId: platform === 'ios' ? String(appId) : undefined,
      playStoreId: platform === 'android' ? String(appId) : undefined,
      description: atApp.description || atApp.summary || '',
      lastUpdated: atApp.last_update || atApp.current_version_release_date ? 
        new Date(atApp.last_update || atApp.current_version_release_date) : undefined
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