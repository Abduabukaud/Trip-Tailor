import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TripTailor – Your Personal Travel Itinerary Generator',
  description: 'Generate personalized trip itineraries and discover amazing trips from around the world.',
  keywords: 'travel, itinerary, trip planning, travel generator, vacation',
  openGraph: {
    title: 'TripTailor – Your Personal Travel Itinerary Generator',
    description: 'Generate personalized trip itineraries and discover amazing trips from around the world.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
