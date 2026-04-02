'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type ItineraryItem = {
  id: string
  day_number: number
  item_order: number
  scheduled_date: string | null
  notes: string | null
  custom_name: string | null
  custom_address: string | null
  source_type: string
  // place fields
  place_name: string
  city: string | null
  region: string | null
  address_line1: string | null
  latitude: number | null
  longitude: number | null
  website_url: string | null
  google_maps_url: string | null
  phone: string | null
  // activity fields
  activity_title: string | null
  category: string | null
  activity_type: string | null
  description: string | null
  tags: string[] | null
  rating: number | null
  review_count: number | null
  estimated_cost_cents: number | null
  duration_minutes: number | null
  effort_level: number | null
  indoor_outdoor: string | null
  family_friendly: boolean | null
  good_for_kids: boolean | null
  good_for_groups: boolean | null
  pet_friendly: boolean | null
  wheelchair_accessible: boolean | null
  reservations_required: boolean | null
  ticket_required: boolean | null
  noise_level: string | null
  price_level: number | null
  source_url: string | null
}

type TripResponse = {
  trip: {
    id: string
    title: string
    destination_city: string
    destination_region: string | null
    start_date: string
    end_date: string
    trip_days: number
  }
  preferences: {
    preferred_categories?: string[] | null
    budget_level?: string | null
    group_size?: number | null
  } | null
  itinerary_items: ItineraryItem[]
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const startFormatted = startDate.toLocaleDateString('en-US', options)
  const endFormatted = endDate.toLocaleDateString('en-US', options)

  return `${startFormatted} – ${endFormatted}`
}

function formatDayDate(dateString: string) {
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function formatCost(cents: number | null): string {
  if (cents === null) return ''
  if (cents === 0) return 'Free'
  return `~$${(cents / 100).toFixed(0)}`
}

function formatDuration(mins: number | null): string {
  if (!mins) return ''
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function effortLabel(level: number | null): string {
  if (level === null) return ''
  return ['', 'Easy', 'Moderate', 'Active', 'Strenuous', 'Extreme'][level] ?? ''
}

function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] ?? colors.gray}`}>
      {label}
    </span>
  )
}

function NotesEditor({
  tripId,
  item,
  onSaved,
}: {
  tripId: string
  item: ItineraryItem
  onSaved: (itemId: string, newNotes: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.notes ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await fetch(`http://localhost:5050/api/v1/trips/${tripId}/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: draft }),
      })
      onSaved(item.id, draft)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="mt-2">
        {item.notes ? (
          <div className="flex items-start gap-2">
            <p className="text-sm text-gray-600 italic flex-1">{item.notes}</p>
            <button
              onClick={() => { setDraft(item.notes ?? ''); setEditing(true) }}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex-shrink-0"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-indigo-600 flex items-center gap-1"
          >
            + Add a note
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-1.5">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add a note about this activity..."
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        rows={2}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="text-xs font-medium bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ActivityCard({
  item,
  index,
  tripId,
  onNotesSaved,
}: {
  item: ItineraryItem
  index: number
  tripId: string
  onNotesSaved: (itemId: string, notes: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const hasDetails =
    item.description ||
    (item.tags && item.tags.length > 0) ||
    item.address_line1 ||
    item.phone ||
    item.website_url ||
    item.google_maps_url ||
    item.ticket_required !== null ||
    item.reservations_required !== null ||
    item.family_friendly !== null ||
    item.wheelchair_accessible !== null

  return (
    <li className="px-5 py-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 leading-snug">{item.place_name}</h3>
                {item.activity_title && item.activity_title !== item.place_name && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.activity_title}</p>
                )}
              </div>
            </div>
            {item.estimated_cost_cents !== null && (
              <span className="flex-shrink-0 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {formatCost(item.estimated_cost_cents)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
            {item.rating !== null && (
              <span className="flex items-center gap-1">
                <span className="text-amber-400">★</span>
                <span className="font-medium text-gray-700">{item.rating.toFixed(1)}</span>
                {item.review_count ? <span className="text-gray-400">({item.review_count.toLocaleString()})</span> : null}
              </span>
            )}
            {item.duration_minutes ? <span>⏱ {formatDuration(item.duration_minutes)}</span> : null}
            {item.effort_level !== null ? <span>{effortLabel(item.effort_level)}</span> : null}
            {item.indoor_outdoor && item.indoor_outdoor !== 'unknown' && (
              <span className="capitalize">
                {item.indoor_outdoor === 'both' ? 'Indoor & Outdoor' : item.indoor_outdoor}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.category && <Badge label={item.category.replace(/_/g, ' ')} color="blue" />}
            {item.ticket_required === true && <Badge label="Ticket required" color="amber" />}
            {item.reservations_required === true && <Badge label="Reservations suggested" color="amber" />}
            {item.family_friendly === true && <Badge label="Family friendly" color="green" />}
            {item.good_for_kids === true && <Badge label="Good for kids" color="green" />}
            {item.good_for_groups === true && <Badge label="Good for groups" color="green" />}
            {item.pet_friendly === true && <Badge label="Pet friendly" color="green" />}
            {item.wheelchair_accessible === true && <Badge label="Accessible" color="purple" />}
            {item.noise_level === 'loud' && <Badge label="Lively" color="rose" />}
            {item.noise_level === 'quiet' && <Badge label="Quiet" color="gray" />}
            {item.source_type === 'user' && <Badge label="Added by you" color="purple" />}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <NotesEditor tripId={tripId} item={item} onSaved={onNotesSaved} />

          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              {expanded ? 'Hide details' : 'View details'}
              <svg
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              )}
              {item.address_line1 && (
                <p className="text-sm text-gray-500">
                  {item.address_line1}{item.city ? `, ${item.city}` : ''}{item.region ? `, ${item.region}` : ''}
                </p>
              )}
              {item.phone && (
                <p className="text-sm text-gray-500">
                  <a href={`tel:${item.phone}`} className="hover:text-indigo-600">{item.phone}</a>
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {item.google_maps_url && (
                  <a href={item.google_maps_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg">
                    Open in Maps
                  </a>
                )}
                {item.website_url && (
                  <a href={item.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg">
                    Website
                  </a>
                )}
                {item.source_url && !item.website_url && (
                  <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg">
                    View listing
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

export default function TripPage() {
  const params = useParams()
  const id = params?.id as string
  const [trip, setTrip] = useState<TripResponse | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  function handleNotesSaved(itemId: string, notes: string) {
    setTrip((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        itinerary_items: prev.itinerary_items.map((item) =>
          item.id === itemId ? { ...item, notes } : item
        ),
      }
    })
  }
  useEffect(() => {
    if (!id) return
    async function loadTrip() {
      try {
        setLoading(true)
        setNotFound(false)

        const res = await fetch(`http://localhost:5050/api/v1/trips/${id}`)

        if (res.status === 404){
          setNotFound(true)
          return
        }
        if (!res.ok) {
          throw new Error('Failed to load trip')
        }

        const data = await res.json()
        setTrip(data)
      } catch (err){
        console.error(err)
        setNotFound(true)
      } finally{
        setLoading(false)
      }
    }
    
    loadTrip()
  }, [id])

  if (notFound) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h1>
          <p className="text-gray-600 mb-6">This itinerary may have been removed or the link is invalid.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/my-trips" className="text-primary-600 font-semibold hover:underline">
              My Trips
            </Link>
            <Link href="/trips" className="text-primary-600 font-semibold hover:underline">
              Explore Trips
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
        <div className="container mx-auto px-6 max-w-6xl space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-xl mt-6" />
        </div>
      </main>
    )
  }

  if (!trip) return null

  const dayNumbers = Array.from(new Set(trip.itinerary_items.map((i) => i.day_number))).sort((a, b) => a - b)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">

        <div className="mb-8">
          <Link
            href="/my-trips"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Trips
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{trip.trip.title}</h1>
          <p className="text-gray-500 mt-1">
            {trip.trip.destination_city}{trip.trip.destination_region ? `, ${trip.trip.destination_region}` : ''} · {formatDateRange(trip.trip.start_date, trip.trip.end_date)}
          </p>
          {trip.preferences?.preferred_categories?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {trip.preferences.preferred_categories.map((c) => (
                <Badge key={c} label={c.replace(/_/g, ' ')} color="purple" />
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {dayNumbers.map((dayNumber) => {
            const dayItems = trip.itinerary_items
              .filter((i) => i.day_number === dayNumber)
              .sort((a, b) => a.item_order - b.item_order)
            const dayDate = dayItems[0]?.scheduled_date

            return (
              <section key={dayNumber} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white">Day {dayNumber}</h2>
                  {dayDate && (
                    <p className="text-indigo-200 text-sm">{formatDayDate(dayDate)}</p>
                  )}
                </div>

                <ul className="divide-y divide-gray-100">
                  {dayItems.map((item, idx) => (
                    <ActivityCard
                      key={item.id}
                      item={item}
                      index={idx}
                      tripId={id}
                      onNotesSaved={handleNotesSaved}
                    />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/generate" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Plan another trip
          </Link>
          <Link href="/my-trips" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            All my trips
          </Link>
        </div>

      </div>
    </main>
  )
}
