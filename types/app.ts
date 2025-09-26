export interface App {
  id: string
  name: string
  developer: string
  icon: string
  rating: number
  ratingsCount: number
  category: string
  platform: 'ios' | 'android' | 'both'
  appStoreId?: string
  playStoreId?: string
  description?: string
  lastUpdated?: Date
  lastAnalyzed?: Date
  sentimentScore?: number
}

export interface Review {
  id: string
  appId: string
  platform: 'ios' | 'android'
  rating: number
  title: string
  content: string
  author: string
  date: Date
  helpful: number
  version?: string
  response?: string
  responseDate?: Date
}

export interface ReviewAnalysis {
  appId: string
  platform: 'ios' | 'android' | 'both'
  totalReviews: number
  averageRating: number
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  topPositiveThemes: string[]
  topNegativeThemes: string[]
  summary: {
    positive: string
    negative: string
  }
  commonIssues: Array<{
    issue: string
    frequency: number
    severity: 'low' | 'medium' | 'high'
  }>
  featureRequests: string[]
  trendData: Array<{
    date: Date
    rating: number
    reviewCount: number
  }>
}

export interface SearchResult {
  apps: App[]
  total: number
  page: number
  pageSize: number
}