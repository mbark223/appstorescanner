import { App } from '@/types/app'

interface ITunesSearchResult {
  resultCount: number
  results: ITunesApp[]
}

interface ITunesApp {
  trackId: number
  trackName: string
  bundleId: string
  artistName: string
  artworkUrl512: string
  averageUserRating: number
  userRatingCount: number
  primaryGenreName: string
  description: string
  sellerName: string
  currentVersionReleaseDate: string
  version: string
  minimumOsVersion: string
  price: number
  formattedPrice: string
  contentAdvisoryRating: string
  screenshotUrls: string[]
  trackViewUrl: string
}

// Search apps using iTunes Search API
export async function searchAppsFromITunes(query: string, limit: number = 50): Promise<App[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=${limit}&country=us`
    )
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`)
    }
    
    const data: ITunesSearchResult = await response.json()
    
    return data.results.map(convertITunesAppToApp)
  } catch (error) {
    console.error('Error searching iTunes:', error)
    return []
  }
}

// Get app details by ID
export async function getAppDetailsFromITunes(appId: string): Promise<App | null> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${appId}&country=us`
    )
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`)
    }
    
    const data: ITunesSearchResult = await response.json()
    
    if (data.results.length > 0) {
      return convertITunesAppToApp(data.results[0])
    }
    
    return null
  } catch (error) {
    console.error('Error fetching app details:', error)
    return null
  }
}

// Convert iTunes app format to our App format
function convertITunesAppToApp(itunesApp: ITunesApp): App {
  return {
    id: itunesApp.trackId.toString(),
    name: itunesApp.trackName,
    developer: itunesApp.artistName,
    icon: itunesApp.artworkUrl512 || '',
    rating: itunesApp.averageUserRating || 0,
    ratingsCount: itunesApp.userRatingCount || 0,
    category: itunesApp.primaryGenreName || 'Other',
    platform: 'ios',
    appStoreId: itunesApp.trackId.toString(),
    playStoreId: undefined,
    description: itunesApp.description || '',
    lastUpdated: itunesApp.currentVersionReleaseDate ? new Date(itunesApp.currentVersionReleaseDate) : undefined
  }
}

// Search by genre/category
export async function searchAppsByCategory(genreId: number, limit: number = 50): Promise<App[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/us/rss/topfreeapplications/limit=${limit}/genre=${genreId}/json`
    )
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`)
    }
    
    const data = await response.json()
    const entries = data.feed?.entry || []
    
    // Convert RSS feed format to App format
    return entries.map((entry: any) => ({
      id: entry.id.attributes['im:id'],
      name: entry['im:name'].label,
      developer: entry['im:artist'].label,
      icon: entry['im:image'][2]?.label || '',
      rating: 0, // RSS feed doesn't include ratings
      ratingsCount: 0,
      category: entry.category.attributes.label,
      platform: 'ios' as const,
      appStoreId: entry.id.attributes['im:id'],
      description: entry.summary?.label || ''
    }))
  } catch (error) {
    console.error('Error searching by category:', error)
    return []
  }
}

// Popular genre IDs for reference
export const GENRE_IDS = {
  BUSINESS: 6000,
  WEATHER: 6001,
  UTILITIES: 6002,
  TRAVEL: 6003,
  SPORTS: 6004,
  SOCIAL_NETWORKING: 6005,
  REFERENCE: 6006,
  PRODUCTIVITY: 6007,
  PHOTO_VIDEO: 6008,
  NEWS: 6009,
  NAVIGATION: 6010,
  MUSIC: 6011,
  LIFESTYLE: 6012,
  HEALTH_FITNESS: 6013,
  GAMES: 6014,
  FINANCE: 6015,
  ENTERTAINMENT: 6016,
  EDUCATION: 6017,
  BOOKS: 6018,
  MEDICAL: 6020,
  MAGAZINES: 6021,
  CATALOGS: 6022,
  FOOD_DRINK: 6023,
  SHOPPING: 6024,
  STICKERS: 6025,
  DEVELOPER_TOOLS: 6026,
  GRAPHICS_DESIGN: 6027
}