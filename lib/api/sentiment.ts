export type SentimentType = 'positive' | 'neutral' | 'negative'

export interface SentimentAnalysis {
  type: SentimentType
  score: number // -1 to 1
  confidence: number // 0 to 1
}

export interface SentimentSummary {
  overall: SentimentType
  distribution: {
    positive: number
    neutral: number
    negative: number
  }
  averageScore: number
}

// Keywords and phrases for sentiment analysis
const POSITIVE_KEYWORDS = [
  'excellent', 'amazing', 'awesome', 'fantastic', 'great', 'love', 'perfect',
  'wonderful', 'best', 'outstanding', 'brilliant', 'superb', 'impressive',
  'recommend', 'helpful', 'useful', 'easy', 'intuitive', 'smooth', 'fast',
  'reliable', 'stable', 'worth', 'enjoy', 'satisfied', 'happy', 'good',
  'nice', 'cool', 'fun', 'beautiful', 'clean', 'simple', 'efficient'
]

const NEGATIVE_KEYWORDS = [
  'terrible', 'awful', 'horrible', 'worst', 'hate', 'useless', 'broken',
  'buggy', 'crash', 'slow', 'laggy', 'disappointing', 'frustrated', 'annoying',
  'bad', 'poor', 'sucks', 'waste', 'trash', 'garbage', 'scam', 'fraud',
  'failed', 'error', 'glitch', 'freeze', 'stuck', 'confusing', 'complicated',
  'expensive', 'overpriced', 'misleading', 'fake', 'spam'
]

const INTENSIFIERS = ['very', 'extremely', 'really', 'absolutely', 'totally', 'completely']
const NEGATIONS = ['not', 'never', 'no', 'none', "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't"]

export function analyzeSentiment(text: string): SentimentAnalysis {
  if (!text || text.trim().length === 0) {
    return { type: 'neutral', score: 0, confidence: 0 }
  }

  const lowerText = text.toLowerCase()
  const words = lowerText.split(/\s+/)
  
  let positiveCount = 0
  let negativeCount = 0
  let intensifierCount = 0
  let negationCount = 0
  
  // Check for keywords
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const prevWord = i > 0 ? words[i - 1] : ''
    
    // Check for negations
    if (NEGATIONS.includes(prevWord)) {
      negationCount++
    }
    
    // Check for intensifiers
    if (INTENSIFIERS.includes(word)) {
      intensifierCount++
    }
    
    // Check positive keywords
    if (POSITIVE_KEYWORDS.some(keyword => word.includes(keyword))) {
      if (NEGATIONS.includes(prevWord)) {
        negativeCount++
      } else {
        positiveCount++
        if (INTENSIFIERS.includes(prevWord)) {
          positiveCount += 0.5
        }
      }
    }
    
    // Check negative keywords
    if (NEGATIVE_KEYWORDS.some(keyword => word.includes(keyword))) {
      if (NEGATIONS.includes(prevWord)) {
        positiveCount++
      } else {
        negativeCount++
        if (INTENSIFIERS.includes(prevWord)) {
          negativeCount += 0.5
        }
      }
    }
  }
  
  // Calculate sentiment score
  const totalKeywords = positiveCount + negativeCount
  if (totalKeywords === 0) {
    return { type: 'neutral', score: 0, confidence: 0.3 }
  }
  
  // Score from -1 to 1
  const score = (positiveCount - negativeCount) / (positiveCount + negativeCount)
  
  // Determine sentiment type
  let type: SentimentType
  if (score > 0.2) {
    type = 'positive'
  } else if (score < -0.2) {
    type = 'negative'
  } else {
    type = 'neutral'
  }
  
  // Calculate confidence based on keyword density
  const wordCount = words.length
  const keywordDensity = totalKeywords / wordCount
  const confidence = Math.min(0.9, keywordDensity * 2 + 0.3)
  
  return {
    type,
    score: Math.max(-1, Math.min(1, score)),
    confidence
  }
}

export function analyzeSentimentWithRating(text: string, rating: number): SentimentAnalysis {
  const textSentiment = analyzeSentiment(text)
  
  // Adjust sentiment based on rating
  let ratingScore = (rating - 3) / 2 // Converts 1-5 to -1 to 1
  
  // Weighted average of text sentiment and rating
  const combinedScore = (textSentiment.score * 0.7) + (ratingScore * 0.3)
  
  let type: SentimentType
  if (combinedScore > 0.2) {
    type = 'positive'
  } else if (combinedScore < -0.2) {
    type = 'negative'
  } else {
    type = 'neutral'
  }
  
  return {
    type,
    score: combinedScore,
    confidence: Math.max(textSentiment.confidence, 0.8) // Higher confidence when we have rating
  }
}

export function calculateSentimentSummary(sentiments: SentimentAnalysis[]): SentimentSummary {
  if (sentiments.length === 0) {
    return {
      overall: 'neutral',
      distribution: { positive: 0, neutral: 0, negative: 0 },
      averageScore: 0
    }
  }
  
  const distribution = {
    positive: 0,
    neutral: 0,
    negative: 0
  }
  
  let totalScore = 0
  
  sentiments.forEach(sentiment => {
    distribution[sentiment.type]++
    totalScore += sentiment.score
  })
  
  const averageScore = totalScore / sentiments.length
  
  // Calculate percentages
  const total = sentiments.length
  distribution.positive = Math.round((distribution.positive / total) * 100)
  distribution.neutral = Math.round((distribution.neutral / total) * 100)
  distribution.negative = Math.round((distribution.negative / total) * 100)
  
  // Determine overall sentiment
  let overall: SentimentType
  if (averageScore > 0.2) {
    overall = 'positive'
  } else if (averageScore < -0.2) {
    overall = 'negative'
  } else {
    overall = 'neutral'
  }
  
  return {
    overall,
    distribution,
    averageScore
  }
}