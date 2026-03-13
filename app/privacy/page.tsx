"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <section className="container mx-auto px-6 py-20 max-w-4xl">
        
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Privacy Policy 🔐
        </h1>

        <p className="text-gray-600 mb-6">
          TripTailor is a student-created project designed to generate travel
          itineraries using publicly available internet data. Your privacy is
          important to us.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Information We Collect
        </h2>
        <p className="text-gray-600 mb-6">
          We may collect information you provide, such as travel preferences,
          destinations, dates, and budget details, in order to generate your
          personalized itinerary.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          How We Use Your Information
        </h2>
        <p className="text-gray-600 mb-6">
          Your information is used solely to create customized travel plans.
          As a student-run project, we do not sell or share your personal data
          with third parties.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Data Sources
        </h2>
        <p className="text-gray-600 mb-6">
          TripTailor uses publicly available internet data to suggest destinations,
          activities, and travel information. Accuracy is not guaranteed.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Contact
        </h2>
        <p className="text-gray-600">
          If you have questions about this policy, please contact the project
          team through the website.
        </p>

      </section>
    </main>
  )
}