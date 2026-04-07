'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FormData {
  destination: string
  travelers: number
  startDate: string
  endDate: string
  budget: 'budget' | 'moderate' | 'luxury'
  style: 'cultural' | 'adventure' | 'relaxation' | 'family'
  interests: string
}

interface ItineraryDay {
  day: number
  title: string
  morning: string
  afternoon: string
  evening: string
  tip: string
  estimatedCost: string
}

interface GeneratedItinerary {
  destination: string
  totalDays: number
  totalBudget: string
  style: string
  days: ItineraryDay[]
  packingTips: string[]
  bestTime: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock itinerary generator
// (replace this function body with a real API call when your backend is ready)
// ─────────────────────────────────────────────────────────────────────────────

function buildItinerary(form: FormData): GeneratedItinerary {
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  const totalDays = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
  )

  const budgetLabel = { budget: '$50–$100/day', moderate: '$100–$200/day', luxury: '$300+/day' }[form.budget]
  const styleLabel = { cultural: 'Cultural & History', adventure: 'Adventure & Outdoors', relaxation: 'Relaxation & Wellness', family: 'Family-Friendly' }[form.style]

  const templates: Record<string, { morning: string; afternoon: string; evening: string; tip: string }[]> = {
    cultural: [
      { morning: 'Visit the main historical museum or heritage site', afternoon: 'Explore the old town & local markets', evening: 'Traditional dinner with live local music', tip: 'Book popular sites in advance to skip queues.' },
      { morning: 'Guided walking tour of the historic quarter', afternoon: 'Art gallery & local craft workshops', evening: 'Street food tour with a local guide', tip: 'Wear comfortable shoes — cobblestones everywhere!' },
      { morning: 'Sacred site or temple visit at dawn', afternoon: 'Cooking class using local ingredients', evening: 'Rooftop restaurant with city views', tip: 'Dress modestly when visiting religious sites.' },
    ],
    adventure: [
      { morning: 'Sunrise hike to a scenic viewpoint', afternoon: 'Water sport or adrenaline activity (kayak, zip line, etc.)', evening: 'Campfire dinner or outdoor BBQ', tip: 'Check weather forecasts the night before.' },
      { morning: 'Guided nature trek through national park', afternoon: 'River crossing or waterfall swim', evening: 'Lodge dinner & stargazing session', tip: 'Pack layers — mountain weather changes fast.' },
      { morning: 'Rock climbing or cycling tour', afternoon: 'Local wildlife spotting excursion', evening: 'Craft beer & local pub dinner', tip: 'Stay hydrated — bring a refillable water bottle.' },
    ],
    relaxation: [
      { morning: 'Sunrise yoga or beach meditation', afternoon: 'Spa treatment or thermal baths', evening: 'Sunset cocktails & fine dining', tip: 'Book spa treatments in advance in high season.' },
      { morning: 'Leisurely breakfast & beach morning', afternoon: 'Boat trip to a secluded cove', evening: 'Seafood dinner at a waterfront restaurant', tip: 'Go to popular beaches early to claim the best spots.' },
      { morning: 'Sleep in & pool morning', afternoon: 'Local market browse & café hopping', evening: 'Private sunset cruise', tip: 'Ask your hotel for their "hidden gem" restaurant recommendation.' },
    ],
    family: [
      { morning: 'Interactive museum or aquarium', afternoon: 'Outdoor park or theme attraction', evening: 'Family-friendly restaurant with kids menu', tip: 'Pack snacks — hungry kids derail even the best itineraries.' },
      { morning: 'Wildlife park or nature centre', afternoon: 'Hands-on local workshop (pottery, cooking)', evening: 'Ice cream walk & evening market', tip: 'Build in rest time every afternoon for younger travelers.' },
      { morning: 'Beach or lake morning with water games', afternoon: 'Boat trip or scenic train ride', evening: 'Pizzeria or casual local favourite', tip: 'Check if attractions offer family discount bundles.' },
    ],
  }

  const tpl = templates[form.style] || templates.cultural

  const days: ItineraryDay[] = []
  for (let i = 0; i < Math.min(totalDays, 14); i++) {
    const t = tpl[i % tpl.length]
    const dayDate = new Date(start)
    dayDate.setDate(start.getDate() + i)
    days.push({
      day: i + 1,
      title: i === 0 ? `Arrive in ${form.destination}` : i === totalDays - 1 ? `Final Day & Departure` : `${styleLabel} – Day ${i + 1}`,
      morning: i === 0 ? 'Check in & orient yourself — grab a map and walk the neighbourhood' : t.morning,
      afternoon: i === 0 ? 'Rest, freshen up, explore close to your accommodation' : t.afternoon,
      evening: i === totalDays - 1 ? 'Last dinner, souvenir shopping & pack for departure' : t.evening,
      tip: t.tip,
      estimatedCost: budgetLabel,
    })
  }

  const packingByStyle: Record<string, string[]> = {
    cultural: ['Modest clothing for religious sites', 'Comfortable walking shoes', 'Small daypack', 'Guidebook or offline maps', 'Reusable shopping bag for markets'],
    adventure: ['Moisture-wicking layers', 'Waterproof jacket', 'Sturdy hiking boots', 'Sunscreen & insect repellent', 'First aid kit & blister pads'],
    relaxation: ['Light linen clothing', 'Quality sunscreen (reef-safe)', 'Good book or e-reader', 'Reusable water bottle', 'Sandals & flip-flops'],
    family: ['Kid-friendly sunscreen', 'Snack stash', 'Portable charger', 'Lightweight stroller or carrier', 'Games & activities for downtime'],
  }

  return {
    destination: form.destination,
    totalDays,
    totalBudget: budgetLabel,
    style: styleLabel,
    days,
    packingTips: packingByStyle[form.style] || packingByStyle.cultural,
    bestTime: 'Check local weather patterns before booking — shoulder seasons often offer the best value.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const [form, setForm] = useState<FormData>({
    destination: '',
    travelers: 2,
    startDate: '',
    endDate: '',
    budget: 'moderate',
    style: 'cultural',
    interests: '',
  })
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedDay, setExpandedDay] = useState<number | null>(1)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.destination.trim()) {
      setError('Please enter a destination.')
      return
    }
    if (!form.startDate || !form.endDate) {
      setError('Please choose start and end dates.')
      return
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date must be after start date.')
      return
    }

    setLoading(true)
    setItinerary(null)

    // Simulate API latency (replace with real fetch when backend is ready)
    await new Promise((r) => setTimeout(r, 1800))

    try {
      const result = buildItinerary(form)
      setItinerary(result)
      setExpandedDay(1)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setItinerary(null)
    setError('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar activePage="generate" />

      {/* Header */}
      <section className="container mx-auto px-6 py-10">
        <div className="max-w-3xl">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Itinerary Generator</p>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Build a trip plan tailored to you
          </h1>
          <p className="text-gray-500 mt-3 leading-relaxed">
            Tell us where you want to go and how you like to travel. We'll craft a day-by-day
            plan with activities, timing, and budget-friendly suggestions — instantly.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        {!itinerary ? (
          // ── Form ──
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <form onSubmit={handleGenerate} className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 space-y-6">

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Destination *</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => set('destination', e.target.value)}
                    placeholder="e.g. Lisbon, Portugal"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Travelers</label>
                  <input
                    type="number"
                    value={form.travelers}
                    onChange={(e) => set('travelers', parseInt(e.target.value) || 1)}
                    min={1}
                    max={20}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => set('endDate', e.target.value)}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
                  <select
                    value={form.budget}
                    onChange={(e) => set('budget', e.target.value as FormData['budget'])}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="budget">Budget-friendly ($50–$100/day)</option>
                    <option value="moderate">Moderate ($100–$200/day)</option>
                    <option value="luxury">Luxury ($300+/day)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Travel style</label>
                  <select
                    value={form.style}
                    onChange={(e) => set('style', e.target.value as FormData['style'])}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="cultural">Cultural & History</option>
                    <option value="adventure">Adventure & Outdoors</option>
                    <option value="relaxation">Relaxation & Wellness</option>
                    <option value="family">Family-Friendly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special interests <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={form.interests}
                  onChange={(e) => set('interests', e.target.value)}
                  rows={3}
                  placeholder="e.g. vegan food, street art, jazz bars, off-the-beaten-path gems…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Building your itinerary…
                  </>
                ) : (
                  '✨ Generate My Itinerary'
                )}
              </button>
            </form>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">What you get</h2>
                <ul className="space-y-3">
                  {[
                    'Day-by-day schedule with timing',
                    'Morning, afternoon & evening activities',
                    'Local food & sightseeing ideas',
                    'Per-day budget guidance',
                    'Packing tips for your style',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
                <p className="text-sm font-semibold text-primary-700 mb-1">🚀 Beta</p>
                <p className="text-sm text-primary-600 leading-relaxed">
                  We're in beta. Your generated itinerary is a smart starting point — we always recommend double-checking opening hours and booking in advance for popular attractions.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Looking for inspiration?</h3>
                <Link href="/trips" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  Browse our curated trips →
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          // ── Itinerary Result ──
          <div className="max-w-4xl mx-auto">
            {/* Header card */}
            <div className="bg-gradient-to-r from-primary-600 to-cyan-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">Your Itinerary</p>
                  <h2 className="text-3xl font-bold">{itinerary.destination}</h2>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
                    <span>📅 {itinerary.totalDays} days</span>
                    <span>💰 {itinerary.totalBudget}</span>
                    <span>🧭 {itinerary.style}</span>
                    <span>👥 {form.travelers} traveler{form.travelers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  ← Edit details
                </button>
              </div>
            </div>

            {/* Day-by-day accordion */}
            <div className="space-y-3 mb-8">
              {itinerary.days.map((day) => (
                <div key={day.day} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {day.day}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{day.title}</p>
                        <p className="text-xs text-gray-400">{day.estimatedCost} estimated</p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedDay === day.day ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedDay === day.day && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {[
                          { label: '🌅 Morning', text: day.morning },
                          { label: '☀️ Afternoon', text: day.afternoon },
                          { label: '🌙 Evening', text: day.evening },
                        ].map((slot) => (
                          <div key={slot.label} className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{slot.label}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{slot.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <p className="text-sm text-amber-700">{day.tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Packing tips + actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎒</span> Packing essentials
                </h3>
                <ul className="space-y-2">
                  {itinerary.packingTips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📌</span> Good to know
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{itinerary.bestTime}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    This itinerary is AI-generated as a starting point. Always verify local conditions,
                    opening hours, and visa requirements before traveling.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={reset}
                className="flex-1 border-2 border-primary-600 text-primary-600 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                ← Plan another trip
              </button>
              <Link
                href="/trips"
                className="flex-1 text-center bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse curated trips →
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
