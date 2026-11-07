'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { formatDate, formatDateTime } from '@/lib/format'
import { STATUSES, Status, statusConfig } from '@/lib/status'
import { ArrowLeft, ExternalLink, MapPin, Calendar, Banknote, FileText, Clock } from 'lucide-react'

type StatusHistory = {
  id: string
  fromStatus: Status | null
  toStatus: Status
  changedAt: string
}

type Application = {
  id: string
  company: string
  role: string
  location: string | null
  jobUrl: string | null
  salaryExpectation: string | null
  status: Status
  appliedAt: string | null
  followUpDate: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  statusHistory: StatusHistory[]
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Status>('SAVED')
  const [notes, setNotes] = useState('')
  const [notesChanged, setNotesChanged] = useState(false)

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/applications/${id}`)
        const data = await res.json()
        if (res.ok) {
          setApplication(data.application)
          setSelectedStatus(data.application.status)
          setNotes(data.application.notes || '')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchApplication()
  }, [id])

  async function handleStatusUpdate() {
    if (!application || selectedStatus === application.status) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })
      if (res.ok) {
        const updatedRes = await fetch(`/api/applications/${id}`)
        const updatedData = await updatedRes.json()
        if (updatedRes.ok) {
          setApplication(updatedData.application)
          setSelectedStatus(updatedData.application.status)
        }
      }
    } finally {
      setUpdating(false)
    }
  }

  async function handleNotesSave() {
    setUpdating(true)
    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      setNotesChanged(false)
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this application?')) return
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    router.push('/dashboard/applications')
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
  }

  if (!application) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Application not found.</p>
        <Link href="/dashboard/applications" className="text-green-600 text-sm mt-2 inline-block">
          Back to Applications
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href="/dashboard/applications"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Applications
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{application.company}</h1>
          <p className="text-gray-600 mt-1">{application.role}</p>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-3">
              {application.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700">{application.location}</span>
                </div>
              )}
              {application.appliedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700">
                    Applied on {formatDate(application.appliedAt)}
                  </span>
                </div>
              )}
              {application.followUpDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-gray-400 shrink-0" />
                  <span className="text-orange-600 font-medium">
                    Follow up on {formatDate(application.followUpDate)}
                  </span>
                </div>
              )}
              {application.salaryExpectation && (
                <div className="flex items-center gap-3 text-sm">
                  <Banknote size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700">{application.salaryExpectation}</span>
                </div>
              )}
              {application.jobUrl && (
                <div className="flex items-center gap-3 text-sm">
                  <ExternalLink size={16} className="text-gray-400 shrink-0" />
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline truncate"
                  >
                    View Job Posting
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                Notes
              </h2>
              {notesChanged && (
                <button
                  onClick={handleNotesSave}
                  disabled={updating}
                  className="text-xs font-medium text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
                setNotesChanged(true)
              }}
              rows={5}
              placeholder="Add interview notes, contact details, next steps..."
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Status</h2>
            <div className="mb-4">
              <StatusBadge status={application.status} />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Status)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white mb-3"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusConfig[status].label}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === application.status}
              className="w-full py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">History</h2>
            {application.statusHistory.length === 0 ? (
              <p className="text-xs text-gray-400">No history yet</p>
            ) : (
              <div className="space-y-3">
                {application.statusHistory.map((entry) => (
                  <div key={entry.id} className="relative pl-4 border-l-2 border-gray-100">
                    <div className="text-xs font-medium text-gray-700">
                      {entry.fromStatus
                        ? `${statusConfig[entry.fromStatus].label} → ${statusConfig[entry.toStatus].label}`
                        : `Added as ${statusConfig[entry.toStatus].label}`}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {formatDateTime(entry.changedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
