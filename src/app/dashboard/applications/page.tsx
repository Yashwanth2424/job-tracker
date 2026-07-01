'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Building2, Calendar, TrendingUp, XCircle } from 'lucide-react'

type Application = {
  id: string
  company: string
  role: string
  status: string
  appliedAt: string | null
  createdAt: string
}

type Stats = {
  total: number
  pending: number
  interviews: number
  offers: number
  rejected: number
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  SAVED: { label: 'Saved', classes: 'bg-gray-100 text-gray-600' },
  APPLIED: { label: 'Applied', classes: 'bg-blue-100 text-blue-700' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', classes: 'bg-purple-100 text-purple-700' },
  INTERVIEW_DONE: { label: 'Interview Done', classes: 'bg-indigo-100 text-indigo-700' },
  OFFER: { label: 'Offer', classes: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', classes: 'bg-red-100 text-red-600' },
  WITHDRAWN: { label: 'Withdrawn', classes: 'bg-orange-100 text-orange-700' },
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/applications')
        const data = await res.json()
        const apps: Application[] = data.applications || []

        setApplications(apps.slice(0, 5))
        setStats({
          total: apps.length,
          pending: apps.filter((a) =>
            ['SAVED', 'APPLIED'].includes(a.status)
          ).length,
          interviews: apps.filter((a) =>
            ['INTERVIEW_SCHEDULED', 'INTERVIEW_DONE'].includes(a.status)
          ).length,
          offers: apps.filter((a) => a.status === 'OFFER').length,
          rejected: apps.filter((a) => a.status === 'REJECTED').length,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function formatDate(dateStr: string | null) {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const statCards = [
    {
      label: 'Total Applications',
      value: stats.total,
      color: 'text-gray-900',
      icon: Building2,
    },
    {
      label: 'Pending',
      value: stats.pending,
      color: 'text-blue-600',
      icon: Calendar,
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      color: 'text-purple-600',
      icon: TrendingUp,
    },
    {
      label: 'Offers',
      value: stats.offers,
      color: 'text-green-600',
      icon: TrendingUp,
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      color: 'text-red-500',
      icon: XCircle,
    },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Track your Werkstudent applications
          </p>
        </div>
        <Link
          href="/dashboard/applications/new"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
        >
          <PlusCircle size={16} />
          Add Application
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <Icon size={16} className="text-gray-300" />
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {loading ? '-' : stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-xs text-green-600 font-medium hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No applications yet</p>
            <Link
              href="/dashboard/applications/new"
              className="text-green-600 text-xs font-medium mt-1 inline-block hover:underline"
            >
              Add your first application
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/applications/${app.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {app.company}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{app.role}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {app.appliedAt && (
                    <span className="text-xs text-gray-400">
                      {formatDate(app.appliedAt)}
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusConfig[app.status]?.classes}`}
                  >
                    {statusConfig[app.status]?.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}