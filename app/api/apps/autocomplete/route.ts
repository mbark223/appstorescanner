import { NextRequest, NextResponse } from 'next/server'

// Popular apps database for autocomplete
const popularApps = [
  // Social & Communication
  { name: 'WhatsApp Messenger', category: 'Social', icon: '💬' },
  { name: 'Instagram', category: 'Social', icon: '📷' },
  { name: 'Facebook', category: 'Social', icon: '👥' },
  { name: 'TikTok', category: 'Entertainment', icon: '🎵' },
  { name: 'Snapchat', category: 'Social', icon: '👻' },
  { name: 'Twitter', category: 'News', icon: '🐦' },
  { name: 'Discord', category: 'Social', icon: '💬' },
  { name: 'Telegram', category: 'Social', icon: '✈️' },
  { name: 'WeChat', category: 'Social', icon: '💚' },
  { name: 'LinkedIn', category: 'Business', icon: '💼' },
  
  // Entertainment & Media
  { name: 'Netflix', category: 'Entertainment', icon: '🎬' },
  { name: 'YouTube', category: 'Video', icon: '📺' },
  { name: 'Spotify', category: 'Music', icon: '🎵' },
  { name: 'Amazon Prime Video', category: 'Entertainment', icon: '🎥' },
  { name: 'Disney+', category: 'Entertainment', icon: '🏰' },
  { name: 'HBO Max', category: 'Entertainment', icon: '🎬' },
  { name: 'Apple Music', category: 'Music', icon: '🎵' },
  { name: 'Twitch', category: 'Entertainment', icon: '🎮' },
  { name: 'SoundCloud', category: 'Music', icon: '☁️' },
  { name: 'Pandora', category: 'Music', icon: '📻' },
  
  // Gaming
  { name: 'Among Us', category: 'Games', icon: '🎮' },
  { name: 'Minecraft', category: 'Games', icon: '⛏️' },
  { name: 'Roblox', category: 'Games', icon: '🎮' },
  { name: 'Call of Duty Mobile', category: 'Games', icon: '🔫' },
  { name: 'Fortnite', category: 'Games', icon: '🏗️' },
  { name: 'PUBG Mobile', category: 'Games', icon: '🔫' },
  { name: 'Candy Crush Saga', category: 'Games', icon: '🍬' },
  { name: 'Pokemon GO', category: 'Games', icon: '🐾' },
  { name: 'Clash of Clans', category: 'Games', icon: '⚔️' },
  { name: 'Genshin Impact', category: 'Games', icon: '⚔️' },
  
  // Productivity & Tools
  { name: 'Gmail', category: 'Productivity', icon: '📧' },
  { name: 'Google Drive', category: 'Productivity', icon: '☁️' },
  { name: 'Microsoft Teams', category: 'Business', icon: '👥' },
  { name: 'Zoom', category: 'Business', icon: '📹' },
  { name: 'Slack', category: 'Business', icon: '💬' },
  { name: 'Notion', category: 'Productivity', icon: '📝' },
  { name: 'Evernote', category: 'Productivity', icon: '📓' },
  { name: 'Dropbox', category: 'Productivity', icon: '📦' },
  { name: 'Google Calendar', category: 'Productivity', icon: '📅' },
  { name: 'Microsoft Outlook', category: 'Productivity', icon: '📧' },
  
  // Shopping & Finance
  { name: 'Amazon', category: 'Shopping', icon: '🛒' },
  { name: 'eBay', category: 'Shopping', icon: '🛍️' },
  { name: 'PayPal', category: 'Finance', icon: '💳' },
  { name: 'Venmo', category: 'Finance', icon: '💸' },
  { name: 'Cash App', category: 'Finance', icon: '💵' },
  { name: 'Robinhood', category: 'Finance', icon: '📈' },
  { name: 'Coinbase', category: 'Finance', icon: '₿' },
  { name: 'Uber', category: 'Travel', icon: '🚗' },
  { name: 'Lyft', category: 'Travel', icon: '🚙' },
  { name: 'DoorDash', category: 'Food', icon: '🍔' },
  
  // Health & Fitness
  { name: 'MyFitnessPal', category: 'Health', icon: '💪' },
  { name: 'Strava', category: 'Health', icon: '🏃' },
  { name: 'Headspace', category: 'Health', icon: '🧘' },
  { name: 'Calm', category: 'Health', icon: '😌' },
  { name: 'Nike Run Club', category: 'Health', icon: '👟' },
  
  // Photography & Design
  { name: 'VSCO', category: 'Photo', icon: '📸' },
  { name: 'Canva', category: 'Design', icon: '🎨' },
  { name: 'Adobe Photoshop', category: 'Design', icon: '🎨' },
  { name: 'Lightroom', category: 'Photo', icon: '📸' },
  { name: 'Pinterest', category: 'Lifestyle', icon: '📌' },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  // Filter apps that match the query
  const suggestions = popularApps
    .filter(app => 
      app.name.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    )
    .slice(0, 8) // Limit to 8 suggestions
    .map(app => ({
      name: app.name,
      category: app.category,
      icon: app.icon
    }))

  return NextResponse.json({ suggestions })
}