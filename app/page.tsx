import Image from 'next/image'
import Link from 'next/link'
import Navbar from './components/Navbar'
import { sampleTrips } from './data/sampleTrips'

const featuredTrips = sampleTrips.filter((t) => ['1', '7', '11'].includes(t.id))

const stats = [
  { value: '50+', label: 'Destinations' },
  { value: '12K+', label: 'Happy Travelers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: 'Free', label: 'To Get Started' },
]

const features = [
  {
    icon: (
      <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Smart Itinerary Generator',
    description: 'Get a personalized day-by-day plan based on your destination, dates, budget, and travel style — in seconds.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Curated Trip Collection',
    description: 'Browse 50+ handpicked adventures across every continent, with real itineraries and honest pricing.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Budget-Friendly Planning',
    description: 'Every itinerary includes transparent price estimates, so you can plan confidently no matter your budget.',
  },
]

const testimonials = [
  {
    name: 'Sofia M.',
    location: 'New York, USA',
    text: 'TripTailor built me a perfect 10-day Japan itinerary in under a minute. I used it almost exactly as generated — the best trip of my life.',
    rating: 5,
    avatar: 'S',
  },
  {
    name: 'James K.',
    location: 'London, UK',
    text: 'I was skeptical at first, but the Patagonia itinerary was incredibly detailed — trail suggestions, gear tips, even what to order for dinner. Blown away.',
    rating: 5,
    avatar: 'J',
  },
  {
    name: 'Priya R.',
    location: 'Sydney, Australia',
    text: 'Found our Bali trip on TripTailor and it was exactly what we wanted. The day-by-day breakdown made planning so easy for our family.',
    rating: 5,
    avatar: 'P',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar activePage="home" />

      {/* ── Hero ── */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            ✈️ AI-powered trip planning — free to use
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Your perfect trip,{' '}
            <span className="text-primary-600">tailored just for you</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Tell us where you want to go and how you like to travel. We'll craft a detailed
            day-by-day itinerary with activities, timing, and budget estimates — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200"
            >
              Generate My Itinerary →
            </Link>
            <Link
              href="/trips"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Browse Trips
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Trips ── */}
      <section className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Explore Trips</p>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                Handpicked adventures to inspire you
              </h2>
              <p className="text-gray-500 mt-2 max-w-xl">
                A sample of what TripTailor can build for you — with full day-by-day itineraries.
              </p>
            </div>
            <Link
              href="/trips"
              className="shrink-0 inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              View all 12 trips →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTrips.map((trip) => (
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {trip.travelStyle}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white text-sm font-medium drop-shadow">{trip.country}</span>
                    <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded-full">
                      {trip.duration}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={Math.floor(trip.rating)} />
                    <span className="text-xs text-gray-500">{trip.rating} ({trip.reviewCount})</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{trip.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{trip.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trip.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-primary-600 font-bold text-sm">{trip.priceRange}</span>
                    <Link
                      href="/trips"
                      className="text-primary-600 text-sm font-semibold hover:text-primary-700 flex items-center gap-1"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container mx-auto px-6 py-20 bg-white rounded-3xl shadow-sm mx-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider text-center">Why TripTailor</p>
          <h2 className="text-4xl font-bold text-center text-gray-900 mt-2 mb-14">
            Everything you need to plan the perfect trip
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider text-center">Traveler Stories</p>
          <h2 className="text-4xl font-bold text-center text-gray-900 mt-2 mb-14">
            Real trips, real travelers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <StarRating rating={t.rating} />
                <p className="text-gray-700 mt-4 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-cyan-500 rounded-3xl p-12 text-center text-white shadow-2xl shadow-primary-200">
          <h2 className="text-4xl font-bold mb-4">Ready for your next adventure?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-xl mx-auto">
            Join thousands of travelers who use TripTailor to plan smarter and travel better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Generate My Itinerary — Free
            </Link>
            <Link
              href="/trips"
              className="inline-block bg-transparent text-white border-2 border-white/60 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Browse All Trips
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 mt-4">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="text-2xl font-bold text-primary-600 mb-3">TripTailor</div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Your personal AI travel planner. Build the perfect itinerary for anywhere in the world, for free.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Product</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/generate" className="text-gray-500 text-sm hover:text-primary-600 transition-colors">Generate Itinerary</Link></li>
                  <li><Link href="/trips" className="text-gray-500 text-sm hover:text-primary-600 transition-colors">Find Trips</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/about" className="text-gray-500 text-sm hover:text-primary-600 transition-colors">About</Link></li>
                  <li><Link href="/contact" className="text-gray-500 text-sm hover:text-primary-600 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Legal</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/privacy" className="text-gray-500 text-sm hover:text-primary-600 transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-gray-500 text-sm hover:text-primary-600 transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TripTailor. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
