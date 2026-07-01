import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Job<span className="text-green-400">Tracker</span>
        </h1>
        <p className="text-gray-400 text-base mb-8">
          Track your Werkstudent applications in one place.
          Status updates, follow-up reminders, and dashboard analytics.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/register"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg text-sm font-semibold hover:border-gray-500 hover:text-white transition"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}