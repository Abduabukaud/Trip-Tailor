'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import { sampleTrips } from '../data/sampleTrips'

const STYLES = ['All', 'Cultural', 'Adventure', 'Relaxation', 'Luxury']
const CONTINENTS = ['All', 'Asia', 'Europe', 'Africa', 'South America', 'North America', 'Oceania']
const DURATIONS = ['All', '1–5 days', '6–9 days', '10–14 days']
const BUDGETS = ['All', 'Under $1,000', '$1,000–$2,000', 'Over $2,000']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TripsPage() {
  const [query, setQuery] = useState('')
  const [style, setStyle] = useState('All')
  const [continent, setContinent] = useState('All')
  const [duration, setDuration] = useState('All')
  const [budget, setBudget] = useState('All')
  const [sort, setSort] = useState<'rating' | 'price' | 'duration'>('rating')

  const filtered = useMemo(() => {
    let list = [...sampleTrips]

    // text search
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.description.toLowerCase().includes(q),
      )
    }

    // travel style
    if (style !== 'All') list = list.filter((t) => t.travelStyle === style)

    // continent
    if (continent !== 'All') list = list.filter((t) => t.continent === continent)

    // duration
    if (duration === '1–5 days') list = list.filter((t) => t.durationDays <= 5)
    else if (duration === '6–9 days') list = list.filter((t) => t.durationDays >= 6 && t.durationDays <= 9)
    else if (duration === '10–14 days') list = list.filter((t) => t.durationDays >= 10)

    // budget
    if (budget === 'Under $1,000') list = list.filter((t) => t.priceMin < 1000)
    else if (budget === '$1,000–$2,000') list = list.filter((t) => t.priceMin >= 1000 && t.priceMin <= 2000)
    else if (budget === 'Over $2,000') list = list.filter((t) => t.priceMin > 2000)

    // sort
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'price') list.sort((a, b) => a.priceMin - b.priceMin)
    else if (sort === 'duration') list.sort((a, b) => a.durationDays - b.durationDays)

    return list
  }, [query, style, continent, duration, budget, sort])

  function clearFilters() {
    setQuery('')
    setStyle('All')
    setContinent('All')
    setDuration('All')
    setBudget('All')
    setSort('rating')
  }

  const hasFilters = query || style !== 'All' || continent !== 'All' || duration !== 'All' || budget !== 'All'

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar activePage="trips" />

      {/* Header */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Explore</p>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-2">Discover Amazing Trips</h1>
          <p className="text-gray-500 max-w-xl">
            Browse {sampleTrips.length} handpicked adventures across every continent. Use the filters to find your perfect match.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {/* Search + sort bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, styles, or activities…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="price">Sort: Price (Low to High)</option>
              <option value="duration">Sort: Duration (Shortest)</option>
            </select>
          </div>

          {/* Filter pills row */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Style */}
            <div className="flex gap-1.5 flex-wrap">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    style === s
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200 self-center hidden sm:block" />

            {/* Continent */}
            <select
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-colors"
            >
              {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
            </select>

            {/* Duration */}
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-colors"
            >
              {DURATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>

            {/* Budget */}
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-colors"
            >
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                ✕ Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-6">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> trip{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Trip grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No trips match your filters</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or clearing the filters.</p>
              <button onClick={clearFilters} className="text-primary-600 font-semibold hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((trip) => (
                <article
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={trip.imageUrl}
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-white/95 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {trip.travelStyle}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        trip.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        trip.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {trip.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      <span className="text-white text-sm font-semibold drop-shadow">{trip.country}</span>
                      <span className="text-white text-xs bg-black/40 px-2 py-1 rounded-full">{trip.duration}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={trip.rating} />
                      <span className="text-xs text-gray-400">{trip.rating} ({trip.reviewCount} reviews)</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1.5">{trip.title}</h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{trip.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trip.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick itinerary peek */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Highlights</p>
                      <ul className="space-y-0.5">
                        {trip.highlights.slice(0, 3).map((h) => (
                          <li key={h} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="text-primary-500 mt-0.5">✓</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="text-primary-600 font-bold">{trip.priceRange}</p>
                      </div>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TripTailor. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
