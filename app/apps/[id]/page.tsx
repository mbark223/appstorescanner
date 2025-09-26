"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Download, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Calendar, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { App } from "@/types/app"
import { ReviewsTab } from "@/components/app/reviews-tab"
import { InsightsTab } from "@/components/app/insights-tab"
import { TrendsTab } from "@/components/app/trends-tab"

export default function AppDetailPage() {
  const params = useParams()
  const appId = params.id as string
  const [loading, setLoading] = useState(true)
  const [app, setApp] = useState<App | null>(null)

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        // Determine platform based on appId format
        const platform = appId.includes('.') ? 'android' : 'ios'
        
        // Try to get app details from AppTweak API
        const detailsResponse = await fetch(`/api/apps/${appId}?platform=${platform}`)
        
        if (detailsResponse.ok) {
          const appData = await detailsResponse.json()
          setApp({
            ...appData,
            lastAnalyzed: new Date(),
            sentimentScore: Math.floor(Math.random() * 20) + 75 // Mock sentiment score 75-95
          })
        } else {
          // Fallback to search API
          const searchResponse = await fetch(`/api/apps/search?q=${encodeURIComponent(appId)}`)
          const searchData = await searchResponse.json()
          
          const foundApp = searchData.apps?.find((a: App) => 
            a.id === appId || 
            a.name.toLowerCase().includes(appId.toLowerCase()) ||
            a.appStoreId === appId ||
            a.playStoreId === appId
          )
          
          if (foundApp) {
            setApp({
              ...foundApp,
              lastAnalyzed: new Date(),
              sentimentScore: Math.floor(Math.random() * 20) + 75
            })
          }
        }
      } catch (error) {
        console.error('Error fetching app details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppDetails()
  }, [appId])

  // Dynamic review summaries based on app category
  const getReviewSummary = (app: App) => {
    const summaries: Record<string, { positive: string[], negative: string[] }> = {
      Music: {
        positive: [
          "Vast music library and playlists",
          "Excellent audio quality",
          "Personalized recommendations",
          "Offline download capability",
          "Cross-platform syncing"
        ],
        negative: [
          "Subscription required for premium features",
          "Occasional connectivity issues",
          "Limited free tier functionality",
          "Battery consumption during streaming",
          "Some regional content restrictions"
        ]
      },
      'Social Networking': {
        positive: [
          "Easy to connect with friends",
          "Rich media sharing features",
          "Real-time messaging",
          "Group communication tools",
          "Privacy controls"
        ],
        negative: [
          "Privacy concerns",
          "Addictive nature",
          "Data usage",
          "Notification overload",
          "Algorithm-driven content"
        ]
      },
      Entertainment: {
        positive: [
          "Wide content variety",
          "High-quality streaming",
          "User-friendly interface",
          "Regular content updates",
          "Multiple device support"
        ],
        negative: [
          "Subscription costs",
          "Content availability varies by region",
          "Internet dependency",
          "Storage space for downloads",
          "Ads in free versions"
        ]
      },
      Games: {
        positive: [
          "Engaging gameplay",
          "Regular updates and events",
          "Social features",
          "Good graphics",
          "Free to play"
        ],
        negative: [
          "In-app purchases",
          "Pay-to-win elements",
          "Battery drain",
          "Large download size",
          "Requires constant internet"
        ]
      }
    }
    
    const defaultSummary = {
      positive: [
        "User-friendly interface",
        "Regular updates",
        "Good performance",
        "Helpful features",
        "Reliable service"
      ],
      negative: [
        "Occasional bugs",
        "Could use more features",
        "Performance issues on older devices",
        "Customer support could be better",
        "Some features require premium"
      ]
    }
    
    return summaries[app.category] || defaultSummary
  }

  const reviewSummary = app ? getReviewSummary(app) : { positive: [], negative: [] }

  const getRatingDistribution = (totalRatings: number) => [
    { rating: 5, percentage: 70, count: Math.floor(totalRatings * 0.7) },
    { rating: 4, percentage: 15, count: Math.floor(totalRatings * 0.15) },
    { rating: 3, percentage: 8, count: Math.floor(totalRatings * 0.08) },
    { rating: 2, percentage: 4, count: Math.floor(totalRatings * 0.04) },
    { rating: 1, percentage: 3, count: Math.floor(totalRatings * 0.03) }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading app details...</p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to search
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">App Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn&apos;t find the app you&apos;re looking for.</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const ratingDistribution = getRatingDistribution(app.ratingsCount)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* App Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
              {app.icon && (
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{app.name}</h1>
              <p className="text-muted-foreground mb-3">{app.developer}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{app.rating}</span>
                  <span className="text-muted-foreground">
                    ({(app.ratingsCount / 1000000).toFixed(0)}M reviews)
                  </span>
                </div>
                <Badge variant="secondary">{app.category}</Badge>
                <div className="flex gap-2">
                  {(app.platform === 'both' || app.platform === 'ios') && (
                    <Badge className="bg-blue-100 text-blue-700">iOS</Badge>
                  )}
                  {(app.platform === 'both' || app.platform === 'android') && (
                    <Badge className="bg-green-100 text-green-700">Android</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {app.appStoreId && (
                <Link 
                  href={`https://apps.apple.com/app/id${app.appStoreId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    App Store
                  </Button>
                </Link>
              )}
              {app.playStoreId && (
                <Link 
                  href={`https://play.google.com/store/apps/details?id=${app.playStoreId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Play Store
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sentiment Score</p>
                    <p className="text-2xl font-bold">{app.sentimentScore || 85}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <Progress value={app.sentimentScore || 85} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Analyzed</p>
                    <p className="text-lg font-medium">
                      {app.lastAnalyzed ? app.lastAnalyzed.toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                    <p className="text-2xl font-bold">
                      {(app.ratingsCount / 1000000).toFixed(0)}M
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium">{item.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <Progress value={item.percentage} className="h-3" />
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Review Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      Top Positive Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {reviewSummary.positive.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsDown className="h-5 w-5 text-red-600" />
                      Top Negative Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {reviewSummary.negative.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <ReviewsTab 
                appId={app.appStoreId || app.playStoreId || app.id} 
                platform={app.platform || 'both'} 
              />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <InsightsTab 
                appId={app.appStoreId || app.playStoreId || app.id} 
                platform={app.platform || 'both'} 
              />
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <TrendsTab 
                appId={app.appStoreId || app.playStoreId || app.id} 
                platform={app.platform || 'both'} 
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}