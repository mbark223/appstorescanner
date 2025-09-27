'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, TrendingUp, Download, DollarSign, Smartphone, Calendar } from 'lucide-react'
import { App } from '@/types/app'
import { motion } from 'framer-motion'

// App Store categories with their IDs
const APP_CATEGORIES = {
  'All': '0',
  'Games': '6014',
  'Business': '6000',
  'Education': '6017',
  'Entertainment': '6016',
  'Finance': '6015',
  'Food & Drink': '6023',
  'Health & Fitness': '6013',
  'Lifestyle': '6012',
  'Medical': '6020',
  'Music': '6011',
  'Navigation': '6010',
  'News': '6009',
  'Photo & Video': '6008',
  'Productivity': '6007',
  'Reference': '6006',
  'Shopping': '6024',
  'Social Networking': '6005',
  'Sports': '6004',
  'Travel': '6003',
  'Utilities': '6002',
  'Weather': '6001'
}

const COUNTRIES = {
  'United States': 'us',
  'United Kingdom': 'gb',
  'Canada': 'ca',
  'Australia': 'au',
  'Germany': 'de',
  'France': 'fr',
  'Japan': 'jp',
  'China': 'cn',
  'India': 'in',
  'Brazil': 'br'
}

interface TopChartsProps {
  initialCategory?: string
}

export function TopCharts({ initialCategory = 'All' }: TopChartsProps) {
  const [apps, setApps] = useState<Record<string, App[]>>({
    free: [],
    grossing: [],
    paid: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(initialCategory)
  const [country, setCountry] = useState('us')
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios')
  const [activeTab, setActiveTab] = useState('free')

  useEffect(() => {
    fetchTopApps()
  }, [category, country, platform])

  const fetchTopApps = async () => {
    setLoading(true)
    setError(null)
    try {
      const categoryId = APP_CATEGORIES[category as keyof typeof APP_CATEGORIES]
      
      // Fetch all three types in parallel
      const [freeRes, grossingRes, paidRes] = await Promise.all([
        fetch(`/api/apps/top-charts?category=${categoryId}&country=${country}&platform=${platform}&type=free`),
        fetch(`/api/apps/top-charts?category=${categoryId}&country=${country}&platform=${platform}&type=grossing`),
        fetch(`/api/apps/top-charts?category=${categoryId}&country=${country}&platform=${platform}&type=paid`)
      ])
      
      // Parse responses carefully
      let freeData, grossingData, paidData
      
      try {
        [freeData, grossingData, paidData] = await Promise.all([
          freeRes.ok ? freeRes.json() : { apps: [], error: true, source: 'error' },
          grossingRes.ok ? grossingRes.json() : { apps: [], error: true, source: 'error' },
          paidRes.ok ? paidRes.json() : { apps: [], error: true, source: 'error' }
        ])
      } catch (parseError) {
        console.error('Failed to parse API responses:', parseError)
        freeData = { apps: [], error: true, source: 'error' }
        grossingData = { apps: [], error: true, source: 'error' }
        paidData = { apps: [], error: true, source: 'error' }
      }
      
      // Check for errors
      if (!freeRes.ok || !grossingRes.ok || !paidRes.ok || 
          freeData.error || grossingData.error || paidData.error) {
        console.error('API error - Status:', {
          free: freeRes.status,
          grossing: grossingRes.status,
          paid: paidRes.status
        })
        console.error('API responses:', { freeData, grossingData, paidData })
        
        // Don't set error if we have data (even if it's from RSS)
        if (freeData.apps?.length === 0 && grossingData.apps?.length === 0 && paidData.apps?.length === 0) {
          setError('Failed to fetch app rankings.')
        }
      }
      
      setApps({
        free: freeData.apps || [],
        grossing: grossingData.apps || [],
        paid: paidData.apps || []
      })
      
      // Log source for debugging
      console.log('Data source:', freeData.source || 'unknown')
    } catch (error) {
      console.error('Failed to fetch top apps:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const getAppIcon = (app: App) => {
    return app.icon || '/app-placeholder.png'
  }

  const renderAppList = (appList: App[]) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (appList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No apps found in this category.</p>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {appList.slice(0, 50).map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Link href={`/apps/${app.appStoreId || app.id}`}>
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-muted-foreground w-8 text-center">
                      {index + 1}
                    </span>
                    <div className="w-14 h-14 relative">
                      <Image
                        src={getAppIcon(app)}
                        alt={app.name}
                        fill
                        className="rounded-xl object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/app-placeholder.png'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{app.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{app.developer}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.5</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {app.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Button size="sm" variant="ghost" className="text-xs">
                      {activeTab === 'paid' ? (app as any).price || '$0.99' : 'GET'}
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                Top Charts
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live Rankings
                </Badge>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time app rankings from the App Store
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(APP_CATEGORIES).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COUNTRIES).map(([name, code]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={platform === 'ios' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPlatform('ios')}
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                iOS
              </Button>
              <Button
                variant={platform === 'android' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPlatform('android')}
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                Android
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs for Free, Grossing, Paid */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="free" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Free
            </TabsTrigger>
            <TabsTrigger value="grossing" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Grossing
            </TabsTrigger>
            <TabsTrigger value="paid" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Paid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-0">
            {renderAppList(apps.free)}
          </TabsContent>

          <TabsContent value="grossing" className="mt-0">
            {renderAppList(apps.grossing)}
          </TabsContent>

          <TabsContent value="paid" className="mt-0">
            {renderAppList(apps.paid)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}