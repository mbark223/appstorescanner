'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, TrendingUp, ChevronRight } from 'lucide-react'
import { App } from '@/types/app'
import { motion } from 'framer-motion'

export function TopSportsApps() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopApps()
  }, [])

  const fetchTopApps = async () => {
    try {
      const response = await fetch('/api/apps/top-charts?category=6004&type=free')
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.details || data.error || 'Failed to fetch apps')
        console.error('API Error:', data)
        
        // Fallback: Try to fetch from cached data
        console.log('Trying fallback to cached sports apps...')
        const fallbackResponse = await fetch('/api/apps/search?q=sports')
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          setApps(fallbackData.apps || [])
          setError(null) // Clear error if fallback works
        }
      } else {
        setApps(data.apps || [])
      }
    } catch (error) {
      console.error('Failed to fetch top apps:', error)
      setError('Network error: Unable to fetch apps')
      
      // Try fallback even on network error
      try {
        const fallbackResponse = await fetch('/api/apps/search?q=sports')
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          setApps(fallbackData.apps || [])
          setError(null)
        }
      } catch (e) {
        console.error('Fallback also failed:', e)
      }
    } finally {
      setLoading(false)
    }
  }

  const getAppIcon = (app: App) => {
    if (app.icon) return app.icon
    if (app.appStoreId) {
      return `https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/00/00/00/00000000-0000-0000-0000-000000000000/AppIcon-0-1x_U007emarketing-0-7-0-85-220-0.png/512x512bb.png`
    }
    return '/app-placeholder.png'
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Top Sports Apps</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Top Sports Apps</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Most popular sports apps on the App Store
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Live Rankings
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apps.slice(0, 50).map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link href={`/apps/${app.appStoreId || app.id}`}>
                <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </Badge>
                    </div>
                    <div className="w-16 h-16 mx-auto mb-3 relative">
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
                  
                  <h3 className="font-medium text-sm text-center line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {app.name}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground text-center line-clamp-1 mb-2">
                    {app.developer}
                  </p>
                  
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{app.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(app.ratingsCount / 1000).toFixed(0)}K)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-primary flex items-center gap-1">
                      View Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {apps.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No apps found. Try refreshing the page.</p>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}