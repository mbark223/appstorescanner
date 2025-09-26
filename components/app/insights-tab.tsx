'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle, 
  XCircle, Star, Users, Package, Smartphone, Globe
} from 'lucide-react'

interface InsightsTabProps {
  appId: string
  platform: 'ios' | 'android' | 'both'
}

interface Insight {
  category: string
  icon: React.ReactNode
  items: {
    title: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
    frequency: number
  }[]
}

export function InsightsTab({ appId, platform }: InsightsTabProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    neutral: 0,
    negative: 0
  })

  useEffect(() => {
    fetchInsights()
  }, [appId, platform])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      // For now, using mock data. Will integrate with AI analysis later
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock insights data
      setInsights([
        {
          category: 'User Experience',
          icon: <Smartphone className="h-5 w-5" />,
          items: [
            {
              title: 'Intuitive Interface',
              description: 'Users love the clean and easy-to-navigate design',
              impact: 'positive',
              frequency: 85
            },
            {
              title: 'App Crashes',
              description: 'Multiple reports of crashes on older devices',
              impact: 'negative',
              frequency: 23
            },
            {
              title: 'Fast Performance',
              description: 'Quick load times and smooth animations praised',
              impact: 'positive',
              frequency: 72
            }
          ]
        },
        {
          category: 'Features',
          icon: <Package className="h-5 w-5" />,
          items: [
            {
              title: 'Missing Features',
              description: 'Users requesting offline mode and dark theme',
              impact: 'neutral',
              frequency: 45
            },
            {
              title: 'Unique Functionality',
              description: 'Standout features that competitors lack',
              impact: 'positive',
              frequency: 68
            }
          ]
        },
        {
          category: 'Customer Support',
          icon: <Users className="h-5 w-5" />,
          items: [
            {
              title: 'Responsive Support',
              description: 'Quick and helpful customer service team',
              impact: 'positive',
              frequency: 56
            },
            {
              title: 'Documentation',
              description: 'Some users find help docs unclear',
              impact: 'negative',
              frequency: 15
            }
          ]
        }
      ])
      
      setSentimentData({
        positive: 68,
        neutral: 20,
        negative: 12
      })
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'negative': return 'text-red-600 bg-red-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="h-4 w-4" />
      case 'negative': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{sentimentData.positive}%</div>
              <p className="text-sm text-muted-foreground">Positive</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{sentimentData.neutral}%</div>
              <p className="text-sm text-muted-foreground">Neutral</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{sentimentData.negative}%</div>
              <p className="text-sm text-muted-foreground">Negative</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-16 text-sm">Positive</div>
              <Progress value={sentimentData.positive} className="flex-1" />
              <div className="w-12 text-sm text-right">{sentimentData.positive}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 text-sm">Neutral</div>
              <Progress value={sentimentData.neutral} className="flex-1" />
              <div className="w-12 text-sm text-right">{sentimentData.neutral}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 text-sm">Negative</div>
              <Progress value={sentimentData.negative} className="flex-1" />
              <div className="w-12 text-sm text-right">{sentimentData.negative}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Insights by Category</h3>
        {insights.map((insight) => (
          <Card key={insight.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {insight.icon}
                {insight.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insight.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Badge className={`${getImpactColor(item.impact)} mt-0.5`} variant="secondary">
                    {getImpactIcon(item.impact)}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Mentioned in</span>
                      <Progress value={item.frequency} className="w-24 h-2" />
                      <span className="text-xs font-medium">{item.frequency}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address App Stability Issues</p>
                <p className="text-xs text-muted-foreground">
                  Focus on fixing crashes reported on older devices to improve user retention
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Implement Requested Features</p>
                <p className="text-xs text-muted-foreground">
                  Consider adding offline mode and dark theme based on user demand
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Improve Documentation</p>
                <p className="text-xs text-muted-foreground">
                  Update help resources to be more comprehensive and user-friendly
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}