"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { App } from "@/types/app"

interface Suggestion {
  name: string
  category: string
  icon: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query) {
      searchApps(query)
    }
  }, [query])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(`/api/apps/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 150)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.name)
    setShowSuggestions(false)
    window.location.href = `/search?q=${encodeURIComponent(suggestion.name)}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
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
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search apps..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(true)
                        setSelectedIndex(-1)
                      }}
                      onFocus={() => {
                        if (suggestions.length > 0) {
                          setShowSuggestions(true)
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('')
                          setSuggestions([])
                          setShowSuggestions(false)
                          inputRef.current?.focus()
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <Button type="submit" size="default">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionsRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg overflow-hidden"
                    >
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors text-left ${
                            index === selectedIndex ? 'bg-muted' : ''
                          }`}
                        >
                          <span className="text-xl">{suggestion.icon}</span>
                          <div className="flex-1 text-sm">
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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