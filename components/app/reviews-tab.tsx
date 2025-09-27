'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Star, User, Calendar, MessageSquare, ThumbsUp, Reply, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { Review } from '@/types/app'
import { format } from 'date-fns'
import { analyzeSentimentWithRating, calculateSentimentSummary, SentimentType } from '@/lib/api/sentiment'

interface ReviewsTabProps {
  appId: string
  platform: 'ios' | 'android' | 'both'
}

export function ReviewsTab({ appId, platform }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<'recent' | 'helpful' | 'critical'>('recent')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [topReviews, setTopReviews] = useState<Review[]>([])
  const [bottomReviews, setBottomReviews] = useState<Review[]>([])
  const [sentimentSummary, setSentimentSummary] = useState<any>(null)

  useEffect(() => {
    fetchReviews()
  }, [appId, platform, sort, page])

  useEffect(() => {
    if (reviews.length > 0) {
      // Calculate top 5 and bottom 5 reviews
      const sortedByRating = [...reviews].sort((a, b) => b.rating - a.rating)
      setTopReviews(sortedByRating.slice(0, 5))
      setBottomReviews(sortedByRating.slice(-5).reverse())
      
      // Calculate sentiment summary
      const sentiments = reviews.map(review => 
        analyzeSentimentWithRating(review.content, review.rating)
      )
      setSentimentSummary(calculateSentimentSummary(sentiments))
    }
  }, [reviews])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const actualPlatform = platform === 'both' ? 'ios' : platform
      const response = await fetch(
        `/api/apps/${appId}/reviews?platform=${actualPlatform}&sort=${sort}&page=${page}`
      )
      const data = await response.json()
      
      if (page === 1) {
        setReviews(data.reviews || [])
      } else {
        setReviews(prev => [...prev, ...(data.reviews || [])])
      }
      setHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-50'
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }
  
  const getSentimentColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  const renderReviewCard = (review: Review, showSentiment: boolean = true) => {
    const sentiment = analyzeSentimentWithRating(review.content, review.rating)
    
    return (
      <Card key={review.id} className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">{renderStars(review.rating)}</div>
                <Badge className={getRatingColor(review.rating)} variant="secondary">
                  {review.rating}/5
                </Badge>
                {showSentiment && (
                  <Badge className={getSentimentColor(sentiment.type)} variant="outline">
                    {sentiment.type}
                  </Badge>
                )}
              </div>
              {review.title && (
                <h4 className="font-semibold text-sm">{review.title}</h4>
              )}
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {review.version && <div>v{review.version}</div>}
              <div>{format(new Date(review.date), 'MMM d, yyyy')}</div>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {review.author}
              </div>
              {review.helpful > 0 && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {review.helpful} helpful
                </div>
              )}
            </div>
          </div>

          {/* Developer Response */}
          {review.response && (
            <div className="mt-3 pl-4 border-l-2 border-muted">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Reply className="h-3 w-3" />
                Developer Response
                {review.responseDate && (
                  <span>• {format(new Date(review.responseDate), 'MMM d, yyyy')}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{review.response}</p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sentiment Analysis Summary */}
      {sentimentSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{sentimentSummary.distribution.positive}%</div>
                <div className="text-sm text-muted-foreground">Positive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{sentimentSummary.distribution.neutral}%</div>
                <div className="text-sm text-muted-foreground">Neutral</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{sentimentSummary.distribution.negative}%</div>
                <div className="text-sm text-muted-foreground">Negative</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Badge className={getSentimentColor(sentimentSummary.overall)} variant="secondary">
                Overall: {sentimentSummary.overall}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 5 Reviews */}
      {topReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top 5 Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topReviews.map(review => renderReviewCard(review, false))}
          </CardContent>
        </Card>
      )}

      {/* Bottom 5 Reviews */}
      {bottomReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Bottom 5 Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bottomReviews.map(review => renderReviewCard(review, false))}
          </CardContent>
        </Card>
      )}

      {/* All Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Reviews</CardTitle>
            <Select value={sort} onValueChange={(value: any) => {
              setSort(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="critical">Most Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && page === 1 ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews found. Try changing the filters.
            </p>
          ) : (
            <>
              {reviews.map(review => renderReviewCard(review))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More Reviews'}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}