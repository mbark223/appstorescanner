"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Star, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { App } from "@/types/app"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      searchApps(query)
    }
  }, [query])

  const searchApps = async (searchTerm: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/apps/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setApps(data.apps || [])
    } catch (error) {
      console.error('Search error:', error)
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold">
              App Store Scanner
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
                <Button type="submit" size="default">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {apps.length > 0 
                  ? `Search Results for "${query}"`
                  : query ? `No results found for "${query}"` : 'Search for an app'
                }
              </h1>
              <p className="text-muted-foreground">
                {apps.length > 0 && `Found ${apps.length} app${apps.length > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {apps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/apps/${app.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            {app.icon ? (
                              <Image
                                src={app.icon}
                                alt={app.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-2xl font-semibold text-muted-foreground">
                                  {app.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg line-clamp-1">
                              {app.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-1">
                              {app.developer}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{app.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">
                                ({formatReviewCount(app.ratingsCount)} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {app.category}
                          </span>
                          {app.platform === 'both' && (
                            <>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                iOS
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Android
                              </span>
                            </>
                          )}
                          {app.platform === 'ios' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              iOS
                            </span>
                          )}
                          {app.platform === 'android' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Android
                            </span>
                          )}
                        </div>
                        {app.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}