'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, TrendingDown, Minus, Star, Download, 
  MessageSquare, Activity, Calendar, ChevronUp, ChevronDown
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TrendsTabProps {
  appId: string
  platform: 'ios' | 'android' | 'both'
}

interface TrendMetric {
  label: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
}

export function TrendsTab({ appId, platform }: TrendsTabProps) {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [metrics, setMetrics] = useState<TrendMetric[]>([])
  const [chartData, setChartData] = useState<any>(null)
  const [ratingChartData, setRatingChartData] = useState<any>(null)

  useEffect(() => {
    fetchTrends()
  }, [appId, platform, timeRange])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics([
        {
          label: 'Average Rating',
          value: '4.6',
          change: 0.2,
          trend: 'up',
          icon: <Star className="h-4 w-4" />
        },
        {
          label: 'Review Volume',
          value: '1.2K/day',
          change: 15,
          trend: 'up',
          icon: <MessageSquare className="h-4 w-4" />
        },
        {
          label: 'Downloads',
          value: '45K/day',
          change: -5,
          trend: 'down',
          icon: <Download className="h-4 w-4" />
        },
        {
          label: 'Response Rate',
          value: '89%',
          change: 3,
          trend: 'up',
          icon: <Activity className="h-4 w-4" />
        }
      ])

      // Mock chart data
      const labels = generateDateLabels(timeRange)
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Review Volume',
            data: generateRandomData(labels.length, 800, 1500),
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Downloads',
            data: generateRandomData(labels.length, 30000, 60000),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      })

      setRatingChartData({
        labels,
        datasets: [
          {
            label: '5 Star',
            data: generateRandomData(labels.length, 50, 70),
            backgroundColor: 'rgb(34, 197, 94)'
          },
          {
            label: '4 Star',
            data: generateRandomData(labels.length, 15, 25),
            backgroundColor: 'rgb(99, 102, 241)'
          },
          {
            label: '3 Star',
            data: generateRandomData(labels.length, 5, 15),
            backgroundColor: 'rgb(251, 146, 60)'
          },
          {
            label: '1-2 Star',
            data: generateRandomData(labels.length, 5, 15),
            backgroundColor: 'rgb(239, 68, 68)'
          }
        ]
      })
    } catch (error) {
      console.error('Failed to fetch trends:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDateLabels = (range: string) => {
    const count = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const labels = []
    const today = new Date()
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    
    return labels
  }

  const generateRandomData = (length: number, min: number, max: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ChevronUp className="h-4 w-4 text-green-600" />
      case 'down': return <ChevronDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                {metric.icon}
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-sm ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span className="ml-1">{Math.abs(metric.change)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Volume & Downloads Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Review Volume & Downloads Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    title: {
                      display: true,
                      text: 'Reviews'
                    }
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    title: {
                      display: true,
                      text: 'Downloads'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }}
              height={300}
            />
          )}
        </CardContent>
      </Card>

      {/* Rating Distribution Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {ratingChartData && (
            <Bar
              data={ratingChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    title: {
                      display: true,
                      text: 'Percentage'
                    }
                  }
                }
              }}
              height={300}
            />
          )}
        </CardContent>
      </Card>

      {/* Trend Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Rating Improvement</p>
              <p className="text-xs text-muted-foreground">
                Average rating has increased by 0.2 stars over the past {timeRange === '7d' ? 'week' : timeRange === '30d' ? 'month' : '3 months'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Review Volume Spike</p>
              <p className="text-xs text-muted-foreground">
                15% increase in daily reviews, possibly due to recent app update or marketing campaign
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Download Decline</p>
              <p className="text-xs text-muted-foreground">
                5% decrease in downloads - consider refreshing app store listing or running promotions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}