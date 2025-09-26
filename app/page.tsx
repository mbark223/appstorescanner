"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Star, TrendingUp, MessageSquare, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Universal App Search",
      description: "Search any app on Apple App Store or Google Play Store"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AI-Powered Summaries",
      description: "Get instant insights from thousands of reviews"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Sentiment Analysis",
      description: "Track user sentiment and rating trends over time"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Reports",
      description: "Download comprehensive reports in PDF or CSV format"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            App Store Scanner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of user feedback with AI-powered review analysis for any mobile app
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter app name or store URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-lg"
              />
              <Button type="submit" size="lg" className="px-8">
                <Search className="mr-2 h-5 w-5" />
                Scan Reviews
              </Button>
            </div>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-3">
            Try: &quot;Instagram&quot;, &quot;Spotify&quot;, or paste an app store URL
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-lg bg-primary/10 p-3 w-fit mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Trending Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "WhatsApp", rating: 4.5, reviews: "156M" },
              { name: "TikTok", rating: 4.6, reviews: "47M" },
              { name: "Netflix", rating: 4.1, reviews: "13M" }
            ].map((app, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{app.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{app.rating}</span>
                      <span>•</span>
                      <span>{app.reviews} reviews</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}