import { NextRequest, NextResponse } from 'next/server'
import { appTweakClient } from '@/lib/api/apptweak'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing AppTweak API...')
    console.log('API Key present:', !!process.env.APPTWEAK_API_KEY)
    console.log('API Key length:', process.env.APPTWEAK_API_KEY?.length)
    
    // Test 1: Try to search for a popular app
    console.log('\nTest 1: Searching for ESPN...')
    const searchResults = await appTweakClient.searchApps('ESPN', 'ios', 'us', 5)
    console.log('Search results:', searchResults.length, 'apps found')
    
    // Test 2: Try the original top charts endpoint
    console.log('\nTest 2: Trying top charts endpoint...')
    try {
      const response = await fetch('https://api.apptweak.com/ios/rankings/top-charts.json?country=us&category=6004&list_type=free&device=iphone', {
        headers: {
          'X-Apptweak-Key': process.env.APPTWEAK_API_KEY || '',
          'Accept': 'application/json'
        }
      })
      
      console.log('Top charts response status:', response.status)
      const text = await response.text()
      console.log('Response body:', text.substring(0, 200))
      
      return NextResponse.json({
        test: 'AppTweak API Test',
        apiKeyPresent: !!process.env.APPTWEAK_API_KEY,
        searchResults: searchResults.length,
        topChartsStatus: response.status,
        responsePreview: text.substring(0, 200)
      })
    } catch (e) {
      console.error('Top charts error:', e)
      return NextResponse.json({
        test: 'AppTweak API Test',
        apiKeyPresent: !!process.env.APPTWEAK_API_KEY,
        searchResults: searchResults.length,
        topChartsError: e instanceof Error ? e.message : 'Unknown error'
      })
    }
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!process.env.APPTWEAK_API_KEY
    }, { status: 500 })
  }
}