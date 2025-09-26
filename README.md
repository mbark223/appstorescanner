# App Store Scanner

An AI-powered web application for analyzing and understanding customer sentiment from mobile app reviews across Apple App Store and Google Play Store.

## Features

- 🔍 **Universal App Search**: Search any app on both major app stores
- 🤖 **AI-Powered Summaries**: Get instant insights from thousands of reviews
- 📊 **Sentiment Analysis**: Track user sentiment and rating trends over time
- 📈 **Visual Analytics**: Interactive charts and visualizations
- 📥 **Export Reports**: Download comprehensive reports in multiple formats
- 🌐 **Cross-Platform**: Compare reviews across iOS and Android

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mbark223/appstorescanner.git
cd appstorescanner
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── api/              # API routes
├── apps/             # App detail pages
├── search/           # Search results page
└── page.tsx          # Landing page

components/
├── ui/               # Reusable UI components
├── dashboard/        # Dashboard components
├── forms/            # Form components
└── layout/           # Layout components

lib/
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
└── api/              # API client functions

types/                # TypeScript type definitions
```

## Environment Variables

See `.env.example` for required environment variables:
- `OPENAI_API_KEY` - For AI-powered review analysis
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis for caching
- Additional API keys for app store data providers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with Next.js and shadcn/ui
- AI-powered analysis using OpenAI
- App data aggregation from various sources