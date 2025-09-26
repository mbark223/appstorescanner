"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Download, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function AppDetailPage() {
  const params = useParams()
  const appId = params.id as string
  const [loading, setLoading] = useState(true)

  // Mock data - in production, this would come from API
  const app = {
    id: appId,
    name: 'WhatsApp Messenger',
    developer: 'WhatsApp LLC',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b7/21/38/b72138f0-9c09-2e7e-15d0-1e6e3a1c1e0f/AppIcon-0-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png',
    rating: 4.5,
    ratingsCount: 156000000,
    category: 'Social Networking',
    platform: 'both' as const,
    description: 'Simple. Reliable. Private.',
    lastAnalyzed: new Date(),
    sentimentScore: 82
  }

  const reviewSummary = {
    positive: [
      "Easy to use messaging interface",
      "End-to-end encryption for privacy",
      "Voice and video calling features",
      "Group chat functionality",
      "File sharing capabilities"
    ],
    negative: [
      "Battery drain issues",
      "Limited customization options",
      "Storage consumption",
      "Occasional connection problems",
      "Missing scheduling features"
    ]
  }

  const ratingDistribution = [
    { rating: 5, percentage: 70, count: 109200000 },
    { rating: 4, percentage: 15, count: 23400000 },
    { rating: 3, percentage: 8, count: 12480000 },
    { rating: 2, percentage: 4, count: 6240000 },
    { rating: 1, percentage: 3, count: 4680000 }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [appId])

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
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sentiment Score</p>
                    <p className="text-2xl font-bold">{app.sentimentScore}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <Progress value={app.sentimentScore} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Analyzed</p>
                    <p className="text-lg font-medium">
                      {app.lastAnalyzed.toLocaleDateString()}
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
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    Review analysis coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    AI-powered insights coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    Trend analysis coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}