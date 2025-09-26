import { App } from '@/types/app'

// Note: These imports will only work server-side
// For client-side, we'll need to create API routes

interface GooglePlayApp {
  appId: string
  title: string
  summary?: string
  description?: string
  descriptionHTML?: string
  developer: string
  developerId?: string
  icon: string
  score: number
  ratings?: number
  reviews?: number
  priceText: string
  free: boolean
  currency?: string
  price?: number
  available: boolean
  offersIAP?: boolean
  IAPRange?: string
  androidVersion?: string
  genre?: string
  genreId?: string
  contentRating?: string
  released?: string
  updated?: number
  version?: string
  recentChanges?: string
  screenshots?: string[]
}

// Convert Google Play app format to our App format
export function convertGooglePlayAppToApp(gpApp: GooglePlayApp): App {
  return {
    id: gpApp.appId,
    name: gpApp.title,
    developer: gpApp.developer,
    icon: gpApp.icon,
    rating: gpApp.score || 0,
    ratingsCount: gpApp.ratings || 0,
    category: gpApp.genre || 'Other',
    platform: 'android',
    appStoreId: undefined,
    playStoreId: gpApp.appId,
    description: gpApp.summary || gpApp.description || '',
    lastUpdated: gpApp.updated ? new Date(gpApp.updated) : undefined
  }
}

// Categories available on Google Play
export const GOOGLE_PLAY_CATEGORIES = {
  APPLICATION: 'APPLICATION',
  ANDROID_WEAR: 'ANDROID_WEAR',
  ART_AND_DESIGN: 'ART_AND_DESIGN',
  AUTO_AND_VEHICLES: 'AUTO_AND_VEHICLES',
  BEAUTY: 'BEAUTY',
  BOOKS_AND_REFERENCE: 'BOOKS_AND_REFERENCE',
  BUSINESS: 'BUSINESS',
  COMICS: 'COMICS',
  COMMUNICATION: 'COMMUNICATION',
  DATING: 'DATING',
  EDUCATION: 'EDUCATION',
  ENTERTAINMENT: 'ENTERTAINMENT',
  EVENTS: 'EVENTS',
  FINANCE: 'FINANCE',
  FOOD_AND_DRINK: 'FOOD_AND_DRINK',
  HEALTH_AND_FITNESS: 'HEALTH_AND_FITNESS',
  HOUSE_AND_HOME: 'HOUSE_AND_HOME',
  LIBRARIES_AND_DEMO: 'LIBRARIES_AND_DEMO',
  LIFESTYLE: 'LIFESTYLE',
  MAPS_AND_NAVIGATION: 'MAPS_AND_NAVIGATION',
  MEDICAL: 'MEDICAL',
  MUSIC_AND_AUDIO: 'MUSIC_AND_AUDIO',
  NEWS_AND_MAGAZINES: 'NEWS_AND_MAGAZINES',
  PARENTING: 'PARENTING',
  PERSONALIZATION: 'PERSONALIZATION',
  PHOTOGRAPHY: 'PHOTOGRAPHY',
  PRODUCTIVITY: 'PRODUCTIVITY',
  SHOPPING: 'SHOPPING',
  SOCIAL: 'SOCIAL',
  SPORTS: 'SPORTS',
  TOOLS: 'TOOLS',
  TRAVEL_AND_LOCAL: 'TRAVEL_AND_LOCAL',
  VIDEO_PLAYERS: 'VIDEO_PLAYERS',
  WEATHER: 'WEATHER',
  GAME: 'GAME',
  GAME_ACTION: 'GAME_ACTION',
  GAME_ADVENTURE: 'GAME_ADVENTURE',
  GAME_ARCADE: 'GAME_ARCADE',
  GAME_BOARD: 'GAME_BOARD',
  GAME_CARD: 'GAME_CARD',
  GAME_CASINO: 'GAME_CASINO',
  GAME_CASUAL: 'GAME_CASUAL',
  GAME_EDUCATIONAL: 'GAME_EDUCATIONAL',
  GAME_MUSIC: 'GAME_MUSIC',
  GAME_PUZZLE: 'GAME_PUZZLE',
  GAME_RACING: 'GAME_RACING',
  GAME_ROLE_PLAYING: 'GAME_ROLE_PLAYING',
  GAME_SIMULATION: 'GAME_SIMULATION',
  GAME_SPORTS: 'GAME_SPORTS',
  GAME_STRATEGY: 'GAME_STRATEGY',
  GAME_TRIVIA: 'GAME_TRIVIA',
  GAME_WORD: 'GAME_WORD'
}

// Collection types
export const GOOGLE_PLAY_COLLECTIONS = {
  TOP_FREE: 'topselling_free',
  TOP_PAID: 'topselling_paid',
  GROSSING: 'topgrossing',
  TRENDING: 'movers_shakers',
  TOP_FREE_GAMES: 'topselling_free_games',
  TOP_PAID_GAMES: 'topselling_paid_games',
  TOP_GROSSING_GAMES: 'topgrossing_game',
  NEW_FREE: 'topselling_new_free',
  NEW_PAID: 'topselling_new_paid',
  NEW_FREE_GAMES: 'topselling_new_free_games',
  NEW_PAID_GAMES: 'topselling_new_paid_games'
}